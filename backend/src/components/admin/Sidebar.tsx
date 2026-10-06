'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Building, Users, PhoneCall, Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Sidebar() {
  const pathname = usePathname()
  
  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Properties', href: '/admin/properties', icon: Building },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Leads', href: '/admin/leads', icon: PhoneCall },
  ]

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-full border-r border-slate-800 flex-shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <Building2 className="h-8 w-8 text-blue-500 mr-3" />
        <span className="text-xl font-bold tracking-tight">NoBroker</span>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6">
        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  isActive ? 'bg-blue-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white',
                  'group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors'
                )}
              >
                <item.icon className={cn(
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-white',
                  'flex-shrink-0 -ml-1 mr-3 h-5 w-5'
                )} />
                <span className="truncate">{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
