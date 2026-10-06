import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, ArrowLeft, X } from 'lucide-react'
import { useFavorites } from '../AppContext'
import PropertyCard from '../components/PropertyCard'

export default function FavoritesPage() {
  const { favorites, toggleFavorite } = useFavorites()
  const navigate = useNavigate()

  return (
    <div className="h-full bg-slate-50 flex flex-col page-enter overflow-hidden">
      <div className="bg-white border-b shadow-sm z-10" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
        <div className="flex items-center px-4 py-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-700 btn-press rounded-full active:bg-slate-100">
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1 flex items-center justify-center gap-2">
            <Heart size={20} className="text-red-500 fill-red-500" />
            <h1 className="text-lg font-bold text-slate-900">Saved Properties</h1>
          </div>
          <div className="w-10 text-right">
            <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">{favorites.length}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 pb-24">
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center mt-12">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
              <Heart size={48} className="text-slate-300" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">No saved properties yet</h2>
            <p className="text-slate-500 mb-8 max-w-xs">
              Tap the heart icon on any property to save it here for easy access.
            </p>
            <button
              onClick={() => navigate('/search')}
              className="bg-primary text-white px-8 py-3.5 rounded-xl font-bold btn-press shadow-md"
            >
              Browse Properties
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {favorites.map((property) => (
              <div key={property.id} className="relative">
                <PropertyCard property={property} />
                <button
                  onClick={() => toggleFavorite(property)}
                  className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur rounded-full text-red-500 z-10 btn-press shadow-sm border border-slate-100"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
