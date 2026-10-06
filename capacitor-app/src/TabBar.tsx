import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Search, PlusCircle, Heart, User } from 'lucide-react'
import { useFavorites } from './AppContext'
import { useAuth } from './AuthContext'

const tabs = [
  { path: '/',          icon: Home,       label: 'Home',    special: false },
  { path: '/search',    icon: Search,     label: 'Search',  special: false },
  { path: '/post',      icon: PlusCircle, label: 'Post',    special: true  },
  { path: '/favorites', icon: Heart,      label: 'Saved',   special: false },
  { path: '/account',   icon: User,       label: 'Account', special: false },
]

export default function TabBar() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { favorites } = useFavorites()
  const { user } = useAuth()

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <div
      className="bg-white border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex items-center">
        {tabs.map(tab => {
          const active = isActive(tab.path)
          const Icon   = tab.icon

          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex-1 flex flex-col items-center justify-center py-2 relative transition-opacity active:opacity-60`}
            >
              {tab.special ? (
                /* Elevated Post button */
                <div className={`-mt-5 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform active:scale-95 ${
                  user?.role === 'owner' && user.isVerified
                    ? 'bg-primary'
                    : 'bg-slate-400'
                }`}>
                  <Icon size={26} color="white" />
                </div>
              ) : (
                <>
                  <div className={`relative transition-transform ${active ? 'scale-105' : 'scale-100'}`}>
                    <Icon
                      size={22}
                      color={active ? '#1E3A5F' : '#94A3B8'}
                      fill={
                        active && tab.path === '/favorites' ? '#ef4444' :
                        active ? 'none' : 'none'
                      }
                      stroke={
                        active && tab.path === '/favorites' ? '#ef4444' :
                        active ? '#1E3A5F' : '#94A3B8'
                      }
                    />
                    {/* Favorites badge */}
                    {tab.path === '/favorites' && favorites.length > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {favorites.length > 9 ? '9+' : favorites.length}
                      </span>
                    )}
                  </div>
                  <span className={`text-[10px] mt-0.5 font-medium transition-colors ${
                    active ? 'text-primary' : 'text-slate-400'
                  }`}>
                    {tab.label}
                  </span>
                  {/* Active dot indicator */}
                  {active && (
                    <span className="absolute bottom-1 w-1 h-1 bg-primary rounded-full" />
                  )}
                </>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
