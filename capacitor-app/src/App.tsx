import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth, ONBOARDING_KEY } from './AuthContext'
import { FavoritesProvider, CompareProvider } from './AppContext'
import { ToastProvider } from './ToastContext'
import TabBar from './TabBar'
import SplashScreen from './pages/SplashScreen'
import OnboardingScreen from './pages/OnboardingScreen'
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import PropertyDetailPage from './pages/PropertyDetailPage'
import FavoritesPage from './pages/FavoritesPage'
import ComparePage from './pages/ComparePage'
import AccountPage from './pages/AccountPage'
import PostPropertyPage from './pages/PostPropertyPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProperties from './pages/admin/AdminProperties'
import AdminUsers from './pages/admin/AdminUsers'

// ─── App Phase Control ────────────────────────────────────────────────────────
type Phase = 'splash' | 'onboarding' | 'app'

function AppShell() {
  const { user, isLoading } = useAuth()
  const [phase, setPhase] = useState<Phase>('splash')

  const handleSplashDone = () => {
    const onboarded = localStorage.getItem(ONBOARDING_KEY)
    setPhase(onboarded ? 'app' : 'onboarding')
  }

  const handleOnboardingDone = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true')
    setPhase('app')
  }

  // Show splash screen first
  if (phase === 'splash') {
    return <SplashScreen onDone={handleSplashDone} />
  }

  // Show onboarding for first-time users
  if (phase === 'onboarding') {
    return <OnboardingScreen onDone={handleOnboardingDone} />
  }

  // Loading auth state
  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center bg-primary"
        style={{ height: '100dvh' }}
      >
        <div className="text-center">
          <div className="text-white text-3xl font-extrabold tracking-tight">NoBroker</div>
          <div className="mt-4 w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
        </div>
      </div>
    )
  }

  // Admin panel — completely separate from the regular app
  if (user?.role === 'admin') {
    return (
      <Routes>
        <Route path="/admin/*" element={
          <AdminLayout>
            <Routes>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="properties" element={<AdminProperties />} />
              <Route path="users" element={<AdminUsers />} />
            </Routes>
          </AdminLayout>
        } />
        {/* Redirect everything else to admin */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    )
  }

  // Regular user app
  return (
    <Routes>
      {/* Auth routes — no tab bar */}
      <Route path="/login"    element={!user ? <LoginPage />    : <Navigate to="/" replace />} />
      <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/" replace />} />

      {/* Main app — with tab bar */}
      <Route path="/*" element={
        <div
          className="flex flex-col"
          style={{ height: '100dvh', overflow: 'hidden' }}
        >
          {/* Page content area — overflow-y-auto allows pages to scroll */}
          <div
            className="flex-1 min-h-0 overflow-y-auto"
          >
            <Routes>
              <Route path="/"               element={<HomePage />} />
              <Route path="/search"         element={<SearchPage />} />
              <Route path="/property/:id"   element={<PropertyDetailPage />} />
              <Route path="/favorites"      element={<FavoritesPage />} />
              <Route path="/compare"        element={<ComparePage />} />
              <Route path="/account"        element={<AccountPage />} />
              <Route path="/post"           element={<PostPropertyPage />} />
            </Routes>
          </div>
          <TabBar />
        </div>
      } />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FavoritesProvider>
          <CompareProvider>
            <ToastProvider>
              <AppShell />
            </ToastProvider>
          </CompareProvider>
        </FavoritesProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
