import { useState, useCallback } from 'react'
import { SearchFilters } from '../types'

export function useSearch() {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<SearchFilters>({})
  
  const updateFilter = useCallback((key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])
  
  const clearFilters = useCallback(() => setFilters({}), [])
  
  const activeFilterCount = Object.values(filters).filter(v => 
    v !== undefined && v !== null && (Array.isArray(v) ? v.length > 0 : true)
  ).length
  
  return { query, setQuery, filters, updateFilter, clearFilters, activeFilterCount }
}
