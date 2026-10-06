'use client'

import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import StatusBadge from '@/components/admin/StatusBadge'
import { formatDate } from '@/lib/utils'

export default function UsersPage() {
  const [data, setData] = useState<any>(null)
  
  useEffect(() => {
    fetch('/api/admin/users')
      .then(res => res.json())
      .then(json => setData(json.data))
  }, [])

  if (!data) return <div className="p-8">Loading users...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Users</h2>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center gap-4 bg-slate-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search users..." 
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select className="border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Roles</option>
            <option value="seeker">Seeker</option>
            <option value="owner">Owner</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Contact</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Joined</th>
              </tr>
            </thead>
            <tbody>
              {data.users.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No users found</td></tr>
              ) : (
                data.users.map((user: any) => (
                  <tr key={user.id} className="bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-medium">
                          {user.name.charAt(0)}
                        </div>
                        <div className="font-medium text-slate-900">{user.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-900">{user.email}</div>
                      <div className="text-slate-500 text-xs">{user.phone || 'No phone'}</div>
                    </td>
                    <td className="px-6 py-4 capitalize">
                      {user.role}
                    </td>
                    <td className="px-6 py-4">
                      {user.is_active ? (
                        <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-medium">Active</span>
                      ) : (
                        <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs font-medium">Disabled</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                      {formatDate(user.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
