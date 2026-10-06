import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit
    
    let query = supabase
      .from('users')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      return NextResponse.json({ data: null, error: error.message }, { status: 400 })
    }

    return NextResponse.json({ 
      data: {
        users: data,
        total: count || 0,
        page,
        totalPages: Math.ceil((count || 0) / limit)
      }, 
      error: null 
    })
  } catch (error: any) {
    return NextResponse.json({ data: null, error: error.message || 'Internal server error' }, { status: 500 })
  }
}
