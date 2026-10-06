import { create } from 'zustand'
import { Property } from '../types'

interface CompareState {
  compareList: Property[]
  addToCompare: (property: Property) => boolean // returns false if already 3
  removeFromCompare: (propertyId: string) => void
  clearCompare: () => void
  isInCompare: (propertyId: string) => boolean
}

export const useCompareStore = create<CompareState>((set, get) => ({
  compareList: [],
  addToCompare: (property) => {
    const { compareList } = get()
    if (compareList.length >= 3) return false
    if (compareList.find(p => p.id === property.id)) return true
    set({ compareList: [...compareList, property] })
    return true
  },
  removeFromCompare: (propertyId) => {
    set((state) => ({ compareList: state.compareList.filter(p => p.id !== propertyId) }))
  },
  clearCompare: () => set({ compareList: [] }),
  isInCompare: (propertyId) => get().compareList.some(p => p.id === propertyId),
}))
