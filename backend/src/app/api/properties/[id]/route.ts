import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: CORS_HEADERS })
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Atomically increment view count
    const { data: existing } = await supabaseAdmin
      .from('properties')
      .select('view_count')
      .eq('id', params.id)
      .single()

    if (existing) {
      await supabaseAdmin
        .from('properties')
        .update({ view_count: (existing.view_count || 0) + 1 })
        .eq('id', params.id)
    }

    const { data, error } = await supabaseAdmin
      .from('properties')
      .select(`
        *,
        owner:owner_id (id, name, avatar_url, is_verified, phone),
        images:property_images (id, url, caption, sort_order),
        amenities:property_amenities (id, amenity)
      `)
      .eq('id', params.id)
      .single()

    if (error || !data) {
      return NextResponse.json({ data: null, error: 'Property not found' }, { status: 404, headers: CORS_HEADERS })
    }

    // For public access, mask owner phone - only reveal on lead creation
    const sanitizedData = {
      ...data,
      owner: data.owner ? {
        id: data.owner.id,
        name: data.owner.name,
        avatarUrl: data.owner.avatar_url,
        isVerified: data.owner.is_verified,
        // phone intentionally omitted from GET - requires lead creation
      } : null,
      images: (data.images || []).sort((a: any, b: any) => a.sort_order - b.sort_order),
      amenities: (data.amenities || []).map((a: any) => a.amenity),
    }

    return NextResponse.json({ data: sanitizedData, error: null }, { headers: CORS_HEADERS })
  } catch (error: any) {
    return NextResponse.json({ data: null, error: error.message || 'Internal server error' }, { status: 500, headers: CORS_HEADERS })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401, headers: CORS_HEADERS })
    }

    // Check ownership
    const { data: property } = await supabaseAdmin
      .from('properties')
      .select('owner_id')
      .eq('id', params.id)
      .single()

    if (!property) {
      return NextResponse.json({ data: null, error: 'Property not found' }, { status: 404, headers: CORS_HEADERS })
    }

    const { data: user } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (property.owner_id !== session.user.id && user?.role !== 'admin') {
      return NextResponse.json({ data: null, error: 'Forbidden' }, { status: 403, headers: CORS_HEADERS })
    }

    const body = await request.json()
    const { amenities, images, ...propertyData } = body

    const { data, error } = await supabaseAdmin
      .from('properties')
      .update({ ...propertyData, updated_at: new Date().toISOString() })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ data: null, error: error.message }, { status: 400, headers: CORS_HEADERS })
    }

    // Update amenities if provided
    if (amenities !== undefined) {
      await supabaseAdmin.from('property_amenities').delete().eq('property_id', params.id)
      if (amenities.length > 0) {
        await supabaseAdmin.from('property_amenities').insert(
          amenities.map((a: string) => ({ property_id: params.id, amenity: a }))
        )
      }
    }

    return NextResponse.json({ data, error: null }, { headers: CORS_HEADERS })
  } catch (error: any) {
    return NextResponse.json({ data: null, error: error.message || 'Internal server error' }, { status: 500, headers: CORS_HEADERS })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401, headers: CORS_HEADERS })
    }

    const { data: property } = await supabaseAdmin
      .from('properties')
      .select('owner_id')
      .eq('id', params.id)
      .single()

    const { data: user } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (property?.owner_id !== session.user.id && user?.role !== 'admin') {
      return NextResponse.json({ data: null, error: 'Forbidden' }, { status: 403, headers: CORS_HEADERS })
    }

    const { error } = await supabaseAdmin
      .from('properties')
      .delete()
      .eq('id', params.id)

    if (error) {
      return NextResponse.json({ data: null, error: error.message }, { status: 400, headers: CORS_HEADERS })
    }

    return NextResponse.json({ data: { success: true }, error: null }, { headers: CORS_HEADERS })
  } catch (error: any) {
    return NextResponse.json({ data: null, error: error.message || 'Internal server error' }, { status: 500, headers: CORS_HEADERS })
  }
}
