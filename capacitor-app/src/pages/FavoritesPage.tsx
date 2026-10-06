import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, Trash2 } from 'lucide-react'
import { useFavorites } from '../AppContext'
import { useAuth } from '../AuthContext'
import PropertyCard from '../components/PropertyCard'

export default function FavoritesPage() {
  const navigate = useNavigate()
  const { favorites, toggleFavorite } = useFavorites()
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <Heart size={40} className="text-red-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Save your favorites</h2>
        <p className="text-slate-500 mb-8 max-w-xs">Sign in to save properties you love and access them from any device.</p>
        <button onClick={() => navigate('/login')} className="w-full max-w-xs py-3.5 bg-primary text-white font-bold rounded-xl active:opacity-90">
          Sign In
        </button>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-slate-50">
      <div className="bg-white px-4 py-4 shadow-sm z-10 flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">Saved Properties ({favorites.length})</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-24">
        {favorites.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="text-6xl mb-4">❤️</div>
            <h2 className="text-xl font-bold text-slate-800">No saved properties yet</h2>
            <p className="text-slate-500 mt-2 mb-8 text-center max-w-xs">Tap the heart icon on properties you like to save them here.</p>
            <button onClick={() => navigate('/search')} className="px-8 py-3.5 bg-primary text-white font-bold rounded-xl active:opacity-90">
              Browse Properties
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {favorites.map(property => (
              <div key={property.id} className="relative">
                <PropertyCard property={property} />
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(property) }}
                  className="absolute bottom-4 right-4 w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm text-red-500 z-10 active:bg-slate-50"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
