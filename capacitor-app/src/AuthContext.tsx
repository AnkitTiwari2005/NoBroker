import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, Notification } from './types'
import { DEMO_USER, DEMO_OWNER } from './mockData'

// ─── Credentials Map ─────────────────────────────────────────────────────────
// Admin: shivskukreja@gmail.com / Admin@NoBroker123
// Seeker demo: demo@nobroker.com / Demo@123
// Owner demo: owner@nobroker.com / Owner@123
// ─────────────────────────────────────────────────────────────────────────────

const ADMIN_USER: User = {
  id: 'admin-shiv-001',
  name: 'Shiv Kukreja',
  email: 'shivskukreja@gmail.com',
  phone: '+91 98117 97407',
  role: 'admin',
  avatarUrl: null,
  isVerified: true,
}

const VALID_CREDENTIALS: Record<string, { password: string; user: User }> = {
  'demo@nobroker.com': { password: 'Demo@123', user: DEMO_USER },
  'owner@nobroker.com': { password: 'Owner@123', user: DEMO_OWNER },
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
    },
  },
  'shivskukreja@gmail.com': { password: 'Admin@NoBroker1234', user: ADMIN_USER },
}

export interface RegisterData {
  name: string
  email: string
  password: string
  phone: string
  role: 'seeker' | 'owner'  // admin cannot self-register
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  notifications: Notification[]
  unreadCount: number
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  markNotificationsRead: () => void
  updateProfile: (data: Partial<Pick<User, 'name' | 'phone' | 'avatarUrl'>>) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

const STORAGE_KEY = 'nobroker_user'
const NOTIFS_KEY = 'nobroker_notifications'
const ONBOARDING_KEY = 'nobroker_onboarded'

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-001',
    title: 'Price Drop Alert',
    body: 'Luxurious 3 BHK in Koramangala — rent reduced to ₹50,000/mo',
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
    read: false,
    type: 'price_drop',
  },
  {
    id: 'notif-002',
    title: 'New Properties in Mumbai',
    body: '12 new listings added in Bandra and Andheri this week',
    timestamp: new Date(Date.now() - 1 * 86400000).toISOString(),
    read: false,
    type: 'new_listing',
  },
  {
    id: 'notif-003',
    title: 'Listing Verified',
    body: 'Your property listing has been verified by NoBroker admin',
    timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
    read: true,
    type: 'verification',
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setUser(JSON.parse(stored))
    } catch { /* ignore */ }
    finally { setIsLoading(false) }
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  const login = async (email: string, password: string) => {
    await new Promise(r => setTimeout(r, 900))
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
      isVerified: false, // owner accounts need admin approval
    }
    setUser(newUser)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem('nobroker_favorites')
  }

  const markNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const updateProfile = (data: Partial<Pick<User, 'name' | 'phone' | 'avatarUrl'>>) => {
    if (!user) return
    const updated = { ...user, ...data }
    setUser(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  return (
    <AuthContext.Provider value={{
      user, isLoading, notifications, unreadCount,
      login, register, logout, markNotificationsRead, updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export { ONBOARDING_KEY }
