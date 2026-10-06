import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: CORS_HEADERS })
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    const body = await request.json()
    const { propertyId, contactType, userName, userPhone } = body

    if (!propertyId || !contactType) {
      return NextResponse.json({ data: null, error: 'propertyId and contactType are required' }, { status: 400, headers: CORS_HEADERS })
    }

    // Get property + owner details
    const { data: property, error: propError } = await supabaseAdmin
      .from('properties')
      .select(`
        id,
        title,
        owner_id,
        owner:owner_id (id, name, phone, avatar_url, is_verified)
      `)
      .eq('id', propertyId)
      .single()

    if (propError || !property) {
      return NextResponse.json({ data: null, error: 'Property not found' }, { status: 404, headers: CORS_HEADERS })
    }

    // Create the lead
    const { data: lead, error: leadError } = await supabaseAdmin
      .from('leads')
      .insert({
        property_id: propertyId,
        user_id: session?.user?.id || null,
        owner_id: property.owner_id,
        contact_type: contactType,
        user_name: userName || null,
        user_phone: userPhone || null,
        status: 'new',
      })
      .select()
      .single()

    if (leadError) {
      return NextResponse.json({ data: null, error: leadError.message }, { status: 400, headers: CORS_HEADERS })
    }

    // Return owner phone so mobile app can initiate call/WhatsApp
    return NextResponse.json({
      data: {
        leadId: lead.id,
        owner: {
          name: (property.owner as any)?.name,
          phone: (property.owner as any)?.phone,
          avatarUrl: (property.owner as any)?.avatar_url,
          isVerified: (property.owner as any)?.is_verified,
        },
        propertyTitle: property.title,
      },
      error: null,
    }, { status: 201, headers: CORS_HEADERS })
  } catch (error: any) {
    return NextResponse.json({ data: null, error: error.message || 'Internal server error' }, { status: 500, headers: CORS_HEADERS })
  }
}
