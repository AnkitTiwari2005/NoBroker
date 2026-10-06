'use client'

import { useRouter } from 'next/navigation'
import { LogOut, Bell } from 'lucide-react'

export default function Header() {
  const router = useRouter()
  
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-slate-800">Admin Panel</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="p-2 text-slate-400 hover:text-slate-500 relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="h-8 w-px bg-slate-200 mx-2"></div>
        
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold mr-3">
            A
          </div>
          <span className="text-sm font-medium text-slate-700 mr-4">Admin User</span>
          <button 
            onClick={handleLogout}
            className="text-slate-500 hover:text-slate-700"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
