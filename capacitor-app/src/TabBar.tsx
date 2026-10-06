import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Search, PlusCircle, Heart, User } from 'lucide-react'
import { useFavorites } from './AppContext'

const tabs = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/search', icon: Search, label: 'Search' },
  { path: '/post', icon: PlusCircle, label: 'Post', special: true },
  { path: '/favorites', icon: Heart, label: 'Saved' },
  { path: '/account', icon: User, label: 'Account' },
]

export default function TabBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { favorites } = useFavorites()

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 safe-bottom z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex">
        {tabs.map(tab => {
          const isActive = location.pathname === tab.path
          const Icon = tab.icon
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="flex-1 flex flex-col items-center justify-center py-2 relative active:opacity-70"
            >
              {tab.special ? (
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mb-0.5 shadow-lg">
                  <Icon size={24} color="white" />
                </div>
              ) : (
                <Icon
                  size={22}
                  color={isActive ? '#1E3A5F' : '#94A3B8'}
                  fill={isActive && tab.path === '/favorites' ? '#ef4444' : 'none'}
                  stroke={isActive && tab.path === '/favorites' ? '#ef4444' : isActive ? '#1E3A5F' : '#94A3B8'}
                />
              )}
              {tab.path === '/favorites' && favorites.length > 0 && (
                <span className="absolute top-1.5 right-1/4 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {favorites.length > 9 ? '9+' : favorites.length}
                </span>
              )}
              {!tab.special && (
                <span className={`text-xs mt-0.5 ${
                  isActive ? 'text-primary font-semibold' : 'text-slate-400'
                }`}>{tab.label}</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
