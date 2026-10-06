import { create } from 'zustand'
import * as SecureStore from 'expo-secure-store'
import { User } from '../types'
import { authService } from '../services/authService'

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  isInitialized: boolean
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  login: (email: string, password: string) => Promise<void>
  register: (data: any) => Promise<void>
  logout: () => Promise<void>
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState>()((
  set, get
) => ({
  user: null,
  token: null,
  isLoading: false,
  isInitialized: false,
  
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  
  login: async (email, password) => {
    set({ isLoading: true })
    try {
      const result = await authService.login(email, password)
      await SecureStore.setItemAsync('auth_token', result.token)
      set({ user: result.user, token: result.token, isLoading: false })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },
  
  register: async (data) => {
    set({ isLoading: true })
    try {
      const result = await authService.register(data)
      await SecureStore.setItemAsync('auth_token', result.token)
      set({ user: result.user, token: result.token, isLoading: false })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },
  
  logout: async () => {
    await SecureStore.deleteItemAsync('auth_token')
    set({ user: null, token: null })
  },
  
  initialize: async () => {
    try {
      const token = await SecureStore.getItemAsync('auth_token')
      if (token) {
        const user = await authService.getMe(token)
        set({ user, token, isInitialized: true })
      } else {
        set({ isInitialized: true })
      }
    } catch {
      await SecureStore.deleteItemAsync('auth_token')
      set({ isInitialized: true })
    }
  }
}))
