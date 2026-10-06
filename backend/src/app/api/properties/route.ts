import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: CORS_HEADERS })
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50)
    const offset = (page - 1) * limit

    let query = supabaseAdmin
      .from('properties')
      .select(`
        *,
        owner:owner_id (id, name, avatar_url, is_verified),
        images:property_images (url, sort_order)
      `, { count: 'exact' })
      .in('status', ['published', 'featured'])

    // Listing type
    const listingType = searchParams.get('listingType')
    if (listingType) query = query.eq('listing_type', listingType)

    // Location
    const city = searchParams.get('city')
    if (city) query = query.ilike('city', `%${city}%`)

    const locality = searchParams.get('locality')
    if (locality) query = query.ilike('locality', `%${locality}%`)

    // Property type
    const propertyType = searchParams.get('propertyType')
    if (propertyType) {
      const types = propertyType.split(',').filter(Boolean)
      if (types.length > 0) query = query.in('property_type', types)
    }

    // Price filters
    const isRent = listingType === 'rent'
    const priceField = isRent ? 'monthly_rent' : 'price'

    const minPrice = searchParams.get('minPrice')
    if (minPrice) query = query.gte(priceField, parseInt(minPrice))

    const maxPrice = searchParams.get('maxPrice')
    if (maxPrice) query = query.lte(priceField, parseInt(maxPrice))

    // Area
    const minArea = searchParams.get('minArea')
    if (minArea) query = query.gte('carpet_area', parseInt(minArea))

    const maxArea = searchParams.get('maxArea')
    if (maxArea) query = query.lte('carpet_area', parseInt(maxArea))

    // Bedrooms
    const bedrooms = searchParams.get('bedrooms')
    if (bedrooms) {
      const beds = bedrooms.split(',').map(Number).filter(n => !isNaN(n))
      if (beds.length > 0) query = query.in('bedrooms', beds)
    }

    // Bathrooms
    const bathrooms = searchParams.get('bathrooms')
    if (bathrooms) {
      const baths = bathrooms.split(',').map(Number).filter(n => !isNaN(n))
      if (baths.length > 0) query = query.in('bathrooms', baths)
    }

    // Furnishing
    const furnishing = searchParams.get('furnishing')
    if (furnishing) {
      const types = furnishing.split(',').filter(Boolean)
      if (types.length > 0) query = query.in('furnishing_status', types)
    }

    // Parking
    const parking = searchParams.get('parking')
    if (parking && parking !== 'none') query = query.eq('parking', parking)

    // Owner filter (for my listings)
    const ownerId = searchParams.get('ownerId')
    if (ownerId) {
      query = supabaseAdmin
        .from('properties')
        .select(`
          *,
          owner:owner_id (id, name, avatar_url, is_verified),
          images:property_images (url, sort_order)
        `, { count: 'exact' })
        .eq('owner_id', ownerId)
    }

    // Sort
    const sort = searchParams.get('sort') || 'newest'
    switch (sort) {
      case 'price_asc':
        query = query.order(priceField, { ascending: true, nullsFirst: false })
        break
      case 'price_desc':
        query = query.order(priceField, { ascending: false, nullsFirst: false })
        break
      case 'area_asc':
        query = query.order('carpet_area', { ascending: true, nullsFirst: false })
        break
      case 'area_desc':
        query = query.order('carpet_area', { ascending: false, nullsFirst: false })
        break
      default:
        query = query.order('created_at', { ascending: false })
    }

    // Featured first
    query = query.order('status', { ascending: true }) // 'featured' < 'published' alphabetically

    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      return NextResponse.json({ data: null, error: error.message }, { status: 400, headers: CORS_HEADERS })
    }

    // Normalize response
    const properties = (data || []).map((p: any) => ({
      ...p,
      coverImageUrl: p.cover_image_url || (p.images?.length > 0 ? p.images.sort((a: any, b: any) => a.sort_order - b.sort_order)[0].url : null),
      owner: p.owner ? {
        id: p.owner.id,
        name: p.owner.name,
        avatarUrl: p.owner.avatar_url,
        isVerified: p.owner.is_verified,
      } : null,
      images: undefined, // Don't return full image list in list view
    }))

    return NextResponse.json({
      data: {
        properties,
        total: count || 0,
        page,
        totalPages: Math.ceil((count || 0) / limit),
      },
      error: null,
    }, { headers: CORS_HEADERS })
  } catch (error: any) {
    return NextResponse.json({ data: null, error: error.message || 'Internal server error' }, { status: 500, headers: CORS_HEADERS })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401, headers: CORS_HEADERS })
    }

    const body = await request.json()
    const { amenities, images, ...propertyData } = body

    // Insert property
    const { data: property, error } = await supabaseAdmin
      .from('properties')
      .insert({
        ...propertyData,
        owner_id: session.user.id,
        status: 'pending', // Always pending for new submissions
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ data: null, error: error.message }, { status: 400, headers: CORS_HEADERS })
    }

    // Insert amenities
    if (amenities && amenities.length > 0) {
      await supabaseAdmin.from('property_amenities').insert(
        amenities.map((a: string) => ({ property_id: property.id, amenity: a }))
      )
    }

    // Insert images
    if (images && images.length > 0) {
      await supabaseAdmin.from('property_images').insert(
        images.map((url: string, index: number) => ({
          property_id: property.id,
          url,
          sort_order: index,
        }))
      )
      // Set cover image
      await supabaseAdmin
        .from('properties')
        .update({ cover_image_url: images[0] })
        .eq('id', property.id)
    }

    return NextResponse.json({ data: property, error: null }, { status: 201, headers: CORS_HEADERS })
  } catch (error: any) {
    return NextResponse.json({ data: null, error: error.message || 'Internal server error' }, { status: 500, headers: CORS_HEADERS })
  }
}
