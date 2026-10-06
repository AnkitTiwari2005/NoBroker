import apiClient from './apiClient'

export const authService = {
  login: (email: string, password: string) => apiClient.post('/auth/login', { email, password }),
  register: (data: any) => apiClient.post('/auth/register', data),
  getMe: (token: string) => apiClient.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } }),
  logout: () => apiClient.post('/auth/logout'),
}
