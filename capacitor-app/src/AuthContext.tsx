import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from './types'
import { DEMO_USER } from './mockData'

// ─── Test Credentials ──────────────────────────────────────────────────────
// Email:    demo@nobroker.com
// Password: Demo@123
// ──────────────────────────────────────────────────────────────────────────

const VALID_CREDENTIALS: Record<string, { password: string; user: User }> = {
  'demo@nobroker.com': { password: 'Demo@123', user: DEMO_USER },
  'owner@nobroker.com': {
    password: 'Owner@123',
    user: {
      id: 'demo-owner-001',
      name: 'Priya Sharma',
      email: 'owner@nobroker.com',
      phone: '+91 99887 76655',
      role: 'owner',
      avatarUrl: null,
      isVerified: true,
    }
  },
  'test@nobroker.com': {
    password: 'Test@123',
    user: {
      id: 'test-user-001',
      name: 'Arjun Kapoor',
      email: 'test@nobroker.com',
      phone: '+91 97700 11223',
      role: 'seeker',
      avatarUrl: null,
      isVerified: false,
    }
  },
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
}

interface RegisterData {
  name: string
  email: string
  password: string
  phone: string
  role: 'seeker' | 'owner'
}

const AuthContext = createContext<AuthContextType | null>(null)

const STORAGE_KEY = 'nobroker_user'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Restore session from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setUser(JSON.parse(stored))
    } catch { /* ignore */ }
    finally { setIsLoading(false) }
  }, [])

  const login = async (email: string, password: string) => {
    await new Promise(r => setTimeout(r, 800)) // simulate network

    const entry = VALID_CREDENTIALS[email.toLowerCase().trim()]
    if (!entry || entry.password !== password) {
      throw new Error('Invalid email or password')
    }

    setUser(entry.user)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entry.user))
  }

  const register = async (data: RegisterData) => {
    await new Promise(r => setTimeout(r, 1000))

    if (VALID_CREDENTIALS[data.email.toLowerCase()]) {
      throw new Error('An account with this email already exists')
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      avatarUrl: null,
      isVerified: false,
    }

    setUser(newUser)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem('nobroker_favorites')
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
