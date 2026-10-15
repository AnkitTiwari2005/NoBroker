import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { Property } from './types'

// ─── Favorites ────────────────────────────────────────────────────────────────
interface FavoritesContextType {
  favoriteIds: Set<string>
  favorites: Property[]
  toggleFavorite: (property: Property) => void
  isFavorited: (id: string) => boolean
}

// ─── Compare ──────────────────────────────────────────────────────────────────
interface CompareContextType {
  compareList: Property[]
  addToCompare: (p: Property) => 'added' | 'already' | 'full'
  removeFromCompare: (id: string) => void
  clearCompare: () => void
  isInCompare: (id: string) => boolean
}

// ─── Recently Viewed ──────────────────────────────────────────────────────────
interface RecentlyViewedContextType {
  recentlyViewed: Property[]
  addRecentlyViewed: (property: Property) => void
  clearRecentlyViewed: () => void
}

export const FavoritesContext      = createContext<FavoritesContextType | null>(null)
export const CompareContext        = createContext<CompareContextType | null>(null)
export const RecentlyViewedContext = createContext<RecentlyViewedContextType | null>(null)

const FAVS_KEY    = 'nobroker_favorites'
const RECENT_KEY  = 'nobroker_recently_viewed'
const MAX_RECENT  = 10

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Property[]>(() => {
    try { return JSON.parse(localStorage.getItem(FAVS_KEY) || '[]') } catch { return [] }
  })

  const favoriteIds = new Set(favorites.map(f => f.id))

  const toggleFavorite = (property: Property) => {
    setFavorites(prev => {
      const updated = favoriteIds.has(property.id)
        ? prev.filter(p => p.id !== property.id)
        : [...prev, property]
      localStorage.setItem(FAVS_KEY, JSON.stringify(updated))
      return updated
    })
  }

  const isFavorited = (id: string) => favoriteIds.has(id)

  return (
    <FavoritesContext.Provider value={{ favoriteIds, favorites, toggleFavorite, isFavorited }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareList, setCompareList] = useState<Property[]>([])

  const addToCompare = (p: Property): 'added' | 'already' | 'full' => {
    if (compareList.find(x => x.id === p.id)) return 'already'
    if (compareList.length >= 3) return 'full'
    setCompareList(prev => [...prev, p])
    return 'added'
  }

  const removeFromCompare = (id: string) => setCompareList(prev => prev.filter(p => p.id !== id))
  const clearCompare = () => setCompareList([])
  const isInCompare  = (id: string) => compareList.some(p => p.id === id)

  return (
    <CompareContext.Provider value={{ compareList, addToCompare, removeFromCompare, clearCompare, isInCompare }}>
      {children}
    </CompareContext.Provider>
  )
}

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  const [recentlyViewed, setRecentlyViewed] = useState<Property[]>(() => {
    try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]') } catch { return [] }
  })

  const addRecentlyViewed = useCallback((property: Property) => {
    setRecentlyViewed(prev => {
      // Remove if already exists, then prepend
      const filtered = prev.filter(p => p.id !== property.id)
      const updated  = [property, ...filtered].slice(0, MAX_RECENT)
      localStorage.setItem(RECENT_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const clearRecentlyViewed = useCallback(() => {
    localStorage.removeItem(RECENT_KEY)
    setRecentlyViewed([])
  }, [])

  return (
    <RecentlyViewedContext.Provider value={{ recentlyViewed, addRecentlyViewed, clearRecentlyViewed }}>
      {children}
    </RecentlyViewedContext.Provider>
  )
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider')
  return ctx
}

export function useCompare() {
  const ctx = useContext(CompareContext)
  if (!ctx) throw new Error('useCompare must be used within CompareProvider')
  return ctx
}

export function useRecentlyViewed() {
  const ctx = useContext(RecentlyViewedContext)
  if (!ctx) throw new Error('useRecentlyViewed must be used within RecentlyViewedProvider')
  return ctx
}
