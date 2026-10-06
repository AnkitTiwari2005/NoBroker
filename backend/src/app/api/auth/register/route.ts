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
    const { email, password, name, phone, role } = body

    if (!email || !password || !name) {
      return NextResponse.json(
        { data: null, error: 'Name, email, and password are required' },
        { status: 400, headers: CORS_HEADERS }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { data: null, error: 'Password must be at least 6 characters' },
        { status: 400, headers: CORS_HEADERS }
      )
    }

    const validRole = role === 'owner' ? 'owner' : 'seeker'

    // Create auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, role: validRole },
    })

    if (authError) {
      if (authError.message.includes('already registered')) {
        return NextResponse.json(
          { data: null, error: 'An account with this email already exists' },
          { status: 409, headers: CORS_HEADERS }
        )
      }
      return NextResponse.json(
        { data: null, error: authError.message },
        { status: 400, headers: CORS_HEADERS }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { data: null, error: 'Failed to create user' },
        { status: 500, headers: CORS_HEADERS }
      )
    }

    // Create profile in our users table
    const { error: dbError } = await supabaseAdmin.from('users').insert({
      id: authData.user.id,
      email,
      name,
      phone: phone || null,
      role: validRole,
      is_verified: false,
      is_active: true,
    })

    if (dbError) {
      // Cleanup: delete the auth user if profile creation fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json(
        { data: null, error: dbError.message },
        { status: 400, headers: CORS_HEADERS }
      )
    }

    // Sign in to get session token
    const { data: sessionData, error: signInError } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError || !sessionData.session) {
      return NextResponse.json({
        data: {
          user: {
            id: authData.user.id,
            name,
            email,
            phone: phone || null,
            role: validRole,
            isVerified: false,
          },
          token: null,
        },
        error: null,
      }, { status: 201, headers: CORS_HEADERS })
    }

    return NextResponse.json({
      data: {
        token: sessionData.session.access_token,
        refreshToken: sessionData.session.refresh_token,
        user: {
          id: authData.user.id,
          name,
          email,
          phone: phone || null,
          avatarUrl: null,
          role: validRole,
          isVerified: false,
        },
      },
      error: null,
    }, { status: 201, headers: CORS_HEADERS })
  } catch (error: any) {
    return NextResponse.json(
      { data: null, error: error.message || 'Internal server error' },
      { status: 500, headers: CORS_HEADERS }
    )
  }
}
