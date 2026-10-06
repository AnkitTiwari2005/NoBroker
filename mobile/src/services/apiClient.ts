import axios from 'axios'
import { API_BASE_URL } from '../config/api'
import { useAuthStore } from '../store/authStore'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

apiClient.interceptors.response.use(
  (response) => response.data.data,
  (error) => Promise.reject(new Error(error.response?.data?.error || 'Something went wrong'))
)

export default apiClient
