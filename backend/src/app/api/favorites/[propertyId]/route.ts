import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: CORS_HEADERS })
}

export async function DELETE(
  request: Request,
  { params }: { params: { propertyId: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401, headers: CORS_HEADERS })
    }

    const { error } = await supabaseAdmin
      .from('favorites')
      .delete()
      .eq('user_id', session.user.id)
      .eq('property_id', params.propertyId)

    if (error) {
      return NextResponse.json({ data: null, error: error.message }, { status: 400, headers: CORS_HEADERS })
    }

    return NextResponse.json({ data: { success: true }, error: null }, { headers: CORS_HEADERS })
  } catch (error: any) {
    return NextResponse.json({ data: null, error: error.message || 'Internal server error' }, { status: 500, headers: CORS_HEADERS })
  }
}
