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
    const listingType = searchParams.get('listingType')

    let query = supabaseAdmin
      .from('properties')
      .select(`
        *,
        owner:owner_id (id, name, avatar_url, is_verified),
        images:property_images (url, sort_order)
      `)
      .eq('status', 'featured')
      .limit(10)
      .order('created_at', { ascending: false })

    if (listingType) {
      query = query.eq('listing_type', listingType)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ data: null, error: error.message }, { status: 400, headers: CORS_HEADERS })
    }

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

    return NextResponse.json({ data: { properties }, error: null }, { headers: CORS_HEADERS })
  } catch (error: any) {
    return NextResponse.json({ data: null, error: error.message || 'Internal server error' }, { status: 500, headers: CORS_HEADERS })
  }
}
