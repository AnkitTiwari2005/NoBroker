import { create } from 'zustand'

interface FavoritesState {
  favoriteIds: Set<string>
  isLoaded: boolean
  setFavorites: (ids: string[]) => void
  addFavorite: (id: string) => void
  removeFavorite: (id: string) => void
  isFavorited: (id: string) => boolean
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favoriteIds: new Set(),
  isLoaded: false,
  setFavorites: (ids) => set({ favoriteIds: new Set(ids), isLoaded: true }),
  addFavorite: (id) => set((state) => ({ favoriteIds: new Set([...state.favoriteIds, id]) })),
  removeFavorite: (id) => set((state) => {
    const newSet = new Set(state.favoriteIds)
    newSet.delete(id)
    return { favoriteIds: newSet }
  }),
  isFavorited: (id) => get().favoriteIds.has(id),
}))
