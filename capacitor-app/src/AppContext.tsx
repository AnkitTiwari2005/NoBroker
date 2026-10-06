import React, { useState, ReactNode } from 'react'
import { Property } from './types'

interface FavoritesContextType {
  favoriteIds: Set<string>
  favorites: Property[]
  toggleFavorite: (property: Property) => void
  isFavorited: (id: string) => boolean
}

interface CompareContextType {
  compareList: Property[]
  addToCompare: (p: Property) => boolean
  removeFromCompare: (id: string) => void
  clearCompare: () => void
  isInCompare: (id: string) => boolean
}

export const FavoritesContext = React.createContext<FavoritesContextType | null>(null)
export const CompareContext = React.createContext<CompareContextType | null>(null)

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

  const addToCompare = (p: Property): boolean => {
    if (compareList.length >= 3) return false
    if (compareList.find(x => x.id === p.id)) return true
    setCompareList(prev => [...prev, p])
    return true
  }

  const removeFromCompare = (id: string) => setCompareList(prev => prev.filter(p => p.id !== id))
  const clearCompare = () => setCompareList([])
  const isInCompare = (id: string) => compareList.some(p => p.id === id)

  return (
    <CompareContext.Provider value={{ compareList, addToCompare, removeFromCompare, clearCompare, isInCompare }}>
      {children}
    </CompareContext.Provider>
  )
}

export function useFavorites() {
  const ctx = React.useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider')
  return ctx
}

export function useCompare() {
  const ctx = React.useContext(CompareContext)
  if (!ctx) throw new Error('useCompare must be used within CompareProvider')
  return ctx
}
