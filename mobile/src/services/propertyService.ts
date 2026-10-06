import apiClient from './apiClient'
import { SearchFilters } from '../types'

export const propertyService = {
  getProperties: (filters: SearchFilters) => apiClient.get('/properties', { params: filters }),
  getProperty: (id: string) => apiClient.get(`/properties/${id}`),
  getFeatured: () => apiClient.get('/properties/featured'),
  searchProperties: (query: string, listingType?: string) => 
    apiClient.get('/properties/search', { params: { q: query, listingType } }),
  createProperty: (data: any) => apiClient.post('/properties', data),
  updateProperty: (id: string, data: any) => apiClient.put(`/properties/${id}`, data),
  deleteProperty: (id: string) => apiClient.delete(`/properties/${id}`),
}
