import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Building2, Plus, Eye, Edit2, Trash2, CheckCircle, Clock, XCircle, Star } from 'lucide-react'
import { useAuth } from '../AuthContext'
import { MOCK_PROPERTIES } from '../mockData'
import { getDisplayPrice, timeAgo } from '../utils'
import { useToast } from '../ToastContext'

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  published: { label: 'Live',      color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
  featured:  { label: 'Featured',  color: 'bg-amber-100 text-amber-700',     icon: Star        },
  pending:   { label: 'Pending',   color: 'bg-yellow-100 text-yellow-700',   icon: Clock       },
  draft:     { label: 'Draft',     color: 'bg-slate-100 text-slate-600',     icon: Edit2       },
  sold:      { label: 'Sold',      color: 'bg-purple-100 text-purple-700',   icon: CheckCircle },
  rented:    { label: 'Rented',    color: 'bg-indigo-100 text-indigo-700',   icon: CheckCircle },
  rejected:  { label: 'Rejected',  color: 'bg-red-100 text-red-700',         icon: XCircle     },
}

export default function MyListingsPage() {
  const navigate  = useNavigate()
  const { user }  = useAuth()
  const { showToast } = useToast()
  const [filter, setFilter] = useState<'all' | 'active' | 'pending' | 'closed'>('all')

  // For demo: show owner-posted mock properties OR show demo listings for owner account
  const ownerListings = MOCK_PROPERTIES.filter(p => {
    // Match by owner email or show sample listings if demo owner account
    if (user?.email === 'owner@nobroker.com') return true
    return p.owner?.name?.toLowerCase().includes(user?.name?.toLowerCase() || '') ||
           p.owner?.id === user?.id
  })

  const filteredListings = ownerListings.filter(p => {
    if (filter === 'all')     return true
    if (filter === 'active')  return ['published', 'featured'].includes(p.status)
    if (filter === 'pending') return p.status === 'pending'
    if (filter === 'closed')  return ['sold', 'rented', 'rejected', 'archived'].includes(p.status)
    return true
  })

  const stats = {
    total:   ownerListings.length,
    active:  ownerListings.filter(p => ['published','featured'].includes(p.status)).length,
    pending: ownerListings.filter(p => p.status === 'pending').length,
    views:   ownerListings.reduce((s, p) => s + (p.viewCount || 0), 0),
  }

  const FILTERS = [
    { key: 'all',     label: 'All',     count: stats.total   },
    { key: 'active',  label: 'Active',  count: stats.active  },
    { key: 'pending', label: 'Pending', count: stats.pending },
    { key: 'closed',  label: 'Closed',  count: ownerListings.filter(p => ['sold','rented','rejected'].includes(p.status)).length },
  ] as const

  return (
    <div className="min-h-screen bg-slate-50 pb-28 page-enter">

      {/* Header */}
      <div className="bg-[#1E3A5F] text-white" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
        <div className="px-4 pt-4 pb-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full btn-press hover:bg-white/10">
            <ArrowLeft size={22} />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">My Listings</h1>
            <p className="text-white/60 text-xs">{stats.total} total properties</p>
          </div>
          <button
            onClick={() => navigate('/post')}
            className="flex items-center gap-1.5 bg-amber-500 text-white px-3 py-2 rounded-xl text-sm font-bold btn-press"
          >
            <Plus size={16} />
            Add New
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="px-4 -mt-1 mb-4">
        <div className="grid grid-cols-4 gap-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-3">
          {[
            { label: 'Total',   value: stats.total,   color: 'text-slate-800' },
            { label: 'Active',  value: stats.active,  color: 'text-emerald-600' },
            { label: 'Pending', value: stats.pending, color: 'text-amber-600' },
            { label: 'Views',   value: stats.views,   color: 'text-blue-600' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-slate-400 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-4 mb-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all btn-press ${
                filter === f.key
                  ? 'bg-[#1E3A5F] text-white'
                  : 'bg-white border border-slate-200 text-slate-600'
              }`}
            >
              {f.label}
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                filter === f.key ? 'bg-white/20' : 'bg-slate-100'
              }`}>{f.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Listings */}
      <div className="px-4 space-y-3">
        {filteredListings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Building2 size={56} className="text-slate-200 mb-4" />
            <h3 className="text-lg font-bold text-slate-700 mb-1">No listings yet</h3>
            <p className="text-sm text-slate-400 mb-6">Post your first property and reach thousands of buyers and renters</p>
            <button
              onClick={() => navigate('/post')}
              className="flex items-center gap-2 bg-[#1E3A5F] text-white px-6 py-3 rounded-xl font-semibold btn-press"
            >
              <Plus size={18} />
              Post a Property
            </button>
          </div>
        ) : (
          filteredListings.map(property => {
            const cfg = STATUS_CONFIG[property.status] || STATUS_CONFIG['pending']
            const StatusIcon = cfg.icon
            return (
              <div key={property.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="flex">
                  {/* Thumbnail */}
                  <div className="w-28 h-28 shrink-0 relative">
                    <img
                      src={property.coverImageUrl || property.images?.[0]?.url}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                    <span className={`absolute top-1.5 left-1.5 flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${cfg.color}`}>
                      <StatusIcon size={9} />
                      {cfg.label}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 p-3 min-w-0">
                    <h3 className="font-bold text-slate-800 text-sm line-clamp-1">{property.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{property.locality}, {property.city}</p>
                    <p className="text-sm font-black text-[#1E3A5F] mt-1">{getDisplayPrice(property)}</p>

                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Eye size={11} />
                        {property.viewCount || 0} views
                      </span>
                      <span>{timeAgo(property.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Action bar */}
                <div className="border-t border-slate-100 flex">
                  <button
                    onClick={() => navigate(`/property/${property.id}`)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-slate-600 btn-press hover:bg-slate-50"
                  >
                    <Eye size={13} />
                    View
                  </button>
                  <div className="w-px bg-slate-100" />
                  <button
                    onClick={() => showToast('Edit listing coming soon', 'info')}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-primary btn-press hover:bg-blue-50"
                  >
                    <Edit2 size={13} />
                    Edit
                  </button>
                  <div className="w-px bg-slate-100" />
                  <button
                    onClick={() => showToast('Listing deleted', 'success')}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-red-500 btn-press hover:bg-red-50"
                  >
                    <Trash2 size={13} />
                    Delete
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
