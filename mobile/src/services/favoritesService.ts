import apiClient from './apiClient'

export const favoritesService = {
  getFavorites: () => apiClient.get('/favorites'),
  addFavorite: (propertyId: string) => apiClient.post('/favorites', { propertyId }),
  removeFavorite: (propertyId: string) => apiClient.delete(`/favorites/${propertyId}`),
}
