import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    const [
      { count: totalProperties },
      { count: publishedProperties },
      { count: pendingProperties },
      { count: featuredProperties },
      { count: totalUsers },
      { count: ownerCount },
      { count: seekerCount },
      { count: totalLeads },
      { count: phoneLeads },
      { count: whatsappLeads }
    ] = await Promise.all([
      supabase.from('properties').select('*', { count: 'exact', head: true }),
      supabase.from('properties').select('*', { count: 'exact', head: true }).eq('status', 'published'),
      supabase.from('properties').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('properties').select('*', { count: 'exact', head: true }).eq('status', 'featured'),
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'owner'),
      supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'seeker'),
      supabase.from('leads').select('*', { count: 'exact', head: true }),
      supabase.from('leads').select('*', { count: 'exact', head: true }).eq('contact_type', 'phone'),
      supabase.from('leads').select('*', { count: 'exact', head: true }).eq('contact_type', 'whatsapp')
    ])

    const stats = {
      totalProperties: totalProperties || 0,
      publishedProperties: publishedProperties || 0,
      pendingProperties: pendingProperties || 0,
      featuredProperties: featuredProperties || 0,
      soldProperties: 0,
      rentedProperties: 0,
      totalUsers: totalUsers || 0,
      ownerCount: ownerCount || 0,
      seekerCount: seekerCount || 0,
      totalLeads: totalLeads || 0,
      phoneLeads: phoneLeads || 0,
      whatsappLeads: whatsappLeads || 0,
      newListingsThisWeek: 0
    }

    return NextResponse.json({ data: stats, error: null })
  } catch (error: any) {
    return NextResponse.json({ data: null, error: error.message || 'Internal server error' }, { status: 500 })
  }
}
