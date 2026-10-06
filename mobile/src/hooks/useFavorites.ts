import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { favoritesService } from '../services/favoritesService'
import { useFavoritesStore } from '../store/favoritesStore'
import { useAuthStore } from '../store/authStore'

export function useFavorites() {
  const { user } = useAuthStore()
  const { setFavorites } = useFavoritesStore()
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const data = await favoritesService.getFavorites()
      setFavorites((data as any[]).map((f: any) => f.property_id))
      return data
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  })

  const toggleMutation = useMutation({
    mutationFn: async ({ propertyId, isFav }: { propertyId: string; isFav: boolean }) => {
      if (isFav) return favoritesService.removeFavorite(propertyId)
      return favoritesService.addFavorite(propertyId)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favorites'] }),
  })

  return { ...query, toggleMutation }
}
