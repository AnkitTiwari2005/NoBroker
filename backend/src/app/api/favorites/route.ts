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
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401, headers: CORS_HEADERS })
    }

    const { data, error } = await supabaseAdmin
      .from('favorites')
      .select(`
        id,
        property_id,
        created_at,
        property:property_id (
          *,
          owner:owner_id (id, name, avatar_url, is_verified),
          images:property_images (url, sort_order)
        )
      `)
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ data: null, error: error.message }, { status: 400, headers: CORS_HEADERS })
    }

    const favorites = (data || []).map((f: any) => ({
      id: f.id,
      propertyId: f.property_id,
      createdAt: f.created_at,
      property: f.property ? {
        ...f.property,
        coverImageUrl: f.property.cover_image_url || (f.property.images?.length > 0
          ? f.property.images.sort((a: any, b: any) => a.sort_order - b.sort_order)[0].url
          : null),
        owner: f.property.owner ? {
          id: f.property.owner.id,
          name: f.property.owner.name,
          avatarUrl: f.property.owner.avatar_url,
          isVerified: f.property.owner.is_verified,
        } : null,
        images: undefined,
      } : null,
    }))

    return NextResponse.json({ data: favorites, error: null }, { headers: CORS_HEADERS })
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

    const { propertyId } = await request.json()

    if (!propertyId) {
      return NextResponse.json({ data: null, error: 'propertyId is required' }, { status: 400, headers: CORS_HEADERS })
    }

    const { data, error } = await supabaseAdmin
      .from('favorites')
      .upsert(
        { user_id: session.user.id, property_id: propertyId },
        { onConflict: 'user_id,property_id', ignoreDuplicates: true }
      )
      .select()
      .single()

    if (error) {
      return NextResponse.json({ data: null, error: error.message }, { status: 400, headers: CORS_HEADERS })
    }

    return NextResponse.json({ data: { success: true }, error: null }, { status: 201, headers: CORS_HEADERS })
  } catch (error: any) {
    return NextResponse.json({ data: null, error: error.message || 'Internal server error' }, { status: 500, headers: CORS_HEADERS })
  }
}
