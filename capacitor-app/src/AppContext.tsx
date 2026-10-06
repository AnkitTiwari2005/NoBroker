import React, { createContext, useContext, useState, ReactNode } from 'react'
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

export const FavoritesContext = createContext<FavoritesContextType | null>(null)
export const CompareContext    = createContext<CompareContextType | null>(null)

const FAVS_KEY = 'nobroker_favorites'

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
