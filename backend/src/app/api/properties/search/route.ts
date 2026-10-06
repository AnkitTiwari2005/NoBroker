import { supabaseAdmin } from '@/lib/supabase-admin'
import { NextResponse } from 'next/server'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: CORS_HEADERS })
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q') || ''
    const listingType = searchParams.get('listingType')

    if (!q.trim()) {
      // Return popular cities and localities
      return NextResponse.json({
        data: {
          suggestions: [
            { type: 'city', value: 'Bangalore', label: 'Bangalore, Karnataka' },
            { type: 'city', value: 'Mumbai', label: 'Mumbai, Maharashtra' },
            { type: 'city', value: 'Delhi', label: 'Delhi, NCR' },
            { type: 'city', value: 'Hyderabad', label: 'Hyderabad, Telangana' },
            { type: 'city', value: 'Chennai', label: 'Chennai, Tamil Nadu' },
            { type: 'city', value: 'Pune', label: 'Pune, Maharashtra' },
          ],
          properties: [],
        },
        error: null,
      }, { headers: CORS_HEADERS })
    }

    let query = supabaseAdmin
      .from('properties')
      .select(`
        *,
        owner:owner_id (id, name, avatar_url, is_verified),
        images:property_images (url, sort_order)
      `)
      .in('status', ['published', 'featured'])
      .or(`title.ilike.%${q}%,city.ilike.%${q}%,locality.ilike.%${q}%,address.ilike.%${q}%,landmark.ilike.%${q}%`)
      .limit(20)
      .order('created_at', { ascending: false })

    if (listingType) {
      query = query.eq('listing_type', listingType)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ data: null, error: error.message }, { status: 400, headers: CORS_HEADERS })
    }

    // Extract unique cities and localities for suggestions
    const cities = new Set<string>()
    const localities = new Set<string>()
    ;(data || []).forEach((p: any) => {
      if (p.city) cities.add(p.city)
      if (p.locality) localities.add(p.locality)
    })

    const suggestions = [
      ...Array.from(cities).map(c => ({ type: 'city', value: c, label: `${c}` })),
      ...Array.from(localities).map(l => ({ type: 'locality', value: l, label: `${l}` })),
    ].slice(0, 8)

    const properties = (data || []).map((p: any) => ({
      ...p,
      coverImageUrl: p.cover_image_url || (p.images?.length > 0
        ? p.images.sort((a: any, b: any) => a.sort_order - b.sort_order)[0].url
        : null),
      owner: p.owner ? {
        id: p.owner.id,
        name: p.owner.name,
        avatarUrl: p.owner.avatar_url,
        isVerified: p.owner.is_verified,
      } : null,
      images: undefined,
    }))

    return NextResponse.json({ data: { suggestions, properties }, error: null }, { headers: CORS_HEADERS })
  } catch (error: any) {
    return NextResponse.json({ data: null, error: error.message || 'Internal server error' }, { status: 500, headers: CORS_HEADERS })
  }
}
