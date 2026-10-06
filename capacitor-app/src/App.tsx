import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './AuthContext'
import { FavoritesProvider, CompareProvider } from './AppContext'
import TabBar from './TabBar'
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import PropertyDetailPage from './pages/PropertyDetailPage'
import FavoritesPage from './pages/FavoritesPage'
import ComparePage from './pages/ComparePage'
import AccountPage from './pages/AccountPage'
import PostPropertyPage from './pages/PostPropertyPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

function AppShell() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-primary">
        <div className="text-center">
          <div className="text-white text-3xl font-extrabold">NoBroker</div>
          <div className="mt-4 w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
        </div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Auth routes - no tab bar */}
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" replace />} />
      <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/" replace />} />
      
      {/* Main app routes - with tab bar */}
      <Route path="/*" element={
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-hidden">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/property/:id" element={<PropertyDetailPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/compare" element={<ComparePage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/post" element={<PostPropertyPage />} />
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
            <AppShell />
          </CompareProvider>
        </FavoritesProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
