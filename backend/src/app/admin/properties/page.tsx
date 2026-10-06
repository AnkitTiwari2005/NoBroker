'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Search, MoreVertical } from 'lucide-react'
import StatusBadge from '@/components/admin/StatusBadge'
import { formatPrice, formatDate } from '@/lib/utils'

export default function PropertiesPage() {
  const [data, setData] = useState<any>(null)
  
  useEffect(() => {
    fetch('/api/admin/properties')
      .then(res => res.json())
      .then(json => setData(json.data))
  }, [])

  if (!data) return <div className="p-8">Loading properties...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Properties</h2>
        <Link href="/admin/properties/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors">
          <Plus className="h-5 w-5 mr-1" />
          Add Property
        </Link>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center gap-4 bg-slate-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search properties..." 
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select className="border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="published">Published</option>
          </select>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Property</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Location</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {data.properties.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-slate-500">No properties found</td></tr>
              ) : (
                data.properties.map((property: any) => (
                  <tr key={property.id} className="bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 max-w-[200px] truncate">
                      {property.title}
                    </td>
                    <td className="px-6 py-4 capitalize">
                      {property.listing_type} • {property.property_type.replace('_', ' ')}
                    </td>
                    <td className="px-6 py-4">
                      {property.locality}, {property.city}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {formatPrice(property.listing_type === 'rent' ? property.monthly_rent : property.price)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={property.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                      {formatDate(property.created_at)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin/properties/${property.id}`} className="text-slate-400 hover:text-slate-600">
                        <MoreVertical className="h-5 w-5 ml-auto" />
                      </Link>
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
