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
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { data: null, error: 'Email and password are required' },
        { status: 400, headers: CORS_HEADERS }
      )
    }

    // Sign in with Supabase
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({ email, password })

    if (error || !data.user || !data.session) {
      return NextResponse.json(
        { data: null, error: 'Invalid email or password' },
        { status: 401, headers: CORS_HEADERS }
      )
    }

    // Get the user profile from our users table
    const { data: profile } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single()

    if (!profile?.is_active) {
      return NextResponse.json(
        { data: null, error: 'Your account has been disabled. Please contact support.' },
        { status: 403, headers: CORS_HEADERS }
      )
    }

    return NextResponse.json({
      data: {
        token: data.session.access_token,
        refreshToken: data.session.refresh_token,
        user: {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          avatarUrl: profile.avatar_url,
          role: profile.role,
          isVerified: profile.is_verified,
        },
      },
      error: null,
    }, { headers: CORS_HEADERS })
  } catch (error: any) {
    return NextResponse.json(
      { data: null, error: error.message || 'Internal server error' },
      { status: 500, headers: CORS_HEADERS }
    )
  }
}
