import { useInfiniteQuery } from '@tanstack/react-query'
import { propertyService } from '../services/propertyService'
import { SearchFilters } from '../types'

export function useProperties(filters: SearchFilters) {
  return useInfiniteQuery({
    queryKey: ['properties', filters],
    queryFn: ({ pageParam = 1 }) => propertyService.getProperties({ ...filters, page: pageParam as number, limit: 20 }),
    getNextPageParam: (lastPage: any) => {
      if (lastPage.page < lastPage.totalPages) return lastPage.page + 1
      return undefined
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
  })
}
