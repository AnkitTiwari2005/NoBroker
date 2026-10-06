import { useQuery } from '@tanstack/react-query'
import { propertyService } from '../services/propertyService'

export function useProperty(id: string) {
  return useQuery({
    queryKey: ['property', id],
    queryFn: () => propertyService.getProperty(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}
