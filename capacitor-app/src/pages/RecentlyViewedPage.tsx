import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, Trash2, Eye } from 'lucide-react'
import { useRecentlyViewed } from '../AppContext'
import PropertyCard from '../components/PropertyCard'

export default function RecentlyViewedPage() {
  const navigate = useNavigate()
  const { recentlyViewed, clearRecentlyViewed } = useRecentlyViewed()

  return (
    <div className="min-h-screen bg-slate-50 pb-28 page-enter">

      {/* Header */}
      <div className="bg-[#1E3A5F] text-white" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
        <div className="px-4 pt-4 pb-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full btn-press hover:bg-white/10">
            <ArrowLeft size={22} />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Recently Viewed</h1>
            <p className="text-white/60 text-xs">{recentlyViewed.length} properties</p>
          </div>
          {recentlyViewed.length > 0 && (
            <button
              onClick={() => { clearRecentlyViewed(); }}
              className="flex items-center gap-1.5 text-white/70 text-xs font-semibold btn-press hover:text-red-300 transition-colors"
            >
              <Trash2 size={14} />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-4">
        {recentlyViewed.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <Clock size={36} className="text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-700 mb-1">No history yet</h3>
            <p className="text-sm text-slate-400 mb-6">Properties you view will appear here so you can easily find them again</p>
            <button
              onClick={() => navigate('/search')}
              className="flex items-center gap-2 bg-[#1E3A5F] text-white px-6 py-3 rounded-xl font-semibold btn-press"
            >
              <Eye size={18} />
              Browse Properties
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {recentlyViewed.map((property, index) => (
              <div key={`${property.id}-${index}`} className="relative card-press">
                <PropertyCard property={property} />
                <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 pointer-events-none">
                  <Clock size={9} />
                  {index === 0 ? 'Just viewed' : `#${index + 1}`}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
