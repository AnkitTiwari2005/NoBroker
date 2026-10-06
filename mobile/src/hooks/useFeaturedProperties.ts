import { useQuery } from '@tanstack/react-query'
import { propertyService } from '../services/propertyService'

export function useFeaturedProperties() {
  return useQuery({
    queryKey: ['properties', 'featured'],
    queryFn: () => propertyService.getFeatured(),
    staleTime: 10 * 60 * 1000,
  })
}
