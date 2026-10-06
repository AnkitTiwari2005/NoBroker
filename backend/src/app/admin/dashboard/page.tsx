'use client'

import { useEffect, useState } from 'react'
import { Building, Users, Home, Clock, Phone, MessageCircle, Star, Target } from 'lucide-react'

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null)
  
  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => setStats(data.data))
  }, [])

  if (!stats) return <div className="p-8">Loading dashboard...</div>

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><Building className="h-6 w-6" /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Properties</p>
            <p className="text-2xl font-bold text-slate-900">{stats.totalProperties}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg"><Home className="h-6 w-6" /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">Published</p>
            <p className="text-2xl font-bold text-slate-900">{stats.publishedProperties}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg"><Clock className="h-6 w-6" /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">Pending Review</p>
            <p className="text-2xl font-bold text-slate-900">{stats.pendingProperties}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg"><Users className="h-6 w-6" /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Users</p>
            <p className="text-2xl font-bold text-slate-900">{stats.totalUsers}</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-500 rounded-lg"><Target className="h-6 w-6" /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Leads</p>
            <p className="text-xl font-bold text-slate-900">{stats.totalLeads}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-500 rounded-lg"><Phone className="h-6 w-6" /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">Phone Leads</p>
            <p className="text-xl font-bold text-slate-900">{stats.phoneLeads}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="p-3 bg-teal-50 text-teal-500 rounded-lg"><MessageCircle className="h-6 w-6" /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">WhatsApp Leads</p>
            <p className="text-xl font-bold text-slate-900">{stats.whatsappLeads}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="p-3 bg-amber-50 text-amber-500 rounded-lg"><Star className="h-6 w-6" /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">Featured Listings</p>
            <p className="text-xl font-bold text-slate-900">{stats.featuredProperties}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
