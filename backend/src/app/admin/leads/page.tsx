'use client'

import { useEffect, useState } from 'react'
import StatusBadge from '@/components/admin/StatusBadge'
import { formatDate } from '@/lib/utils'
import { MessageCircle, Phone } from 'lucide-react'

export default function LeadsPage() {
  const [data, setData] = useState<any>(null)
  
  useEffect(() => {
    fetch('/api/admin/leads')
      .then(res => res.json())
      .then(json => setData(json.data))
  }, [])

  if (!data) return <div className="p-8">Loading leads...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Leads</h2>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Property</th>
                <th className="px-6 py-3">Seeker Info</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Owner</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.leads.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">No leads found</td></tr>
              ) : (
                data.leads.map((lead: any) => (
                  <tr key={lead.id} className="bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 max-w-[200px] truncate">
                      {lead.property?.title || 'Unknown Property'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-900">{lead.user_name}</div>
                      <div className="text-slate-500 text-xs">{lead.user_phone}</div>
                    </td>
                    <td className="px-6 py-4 capitalize">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        {lead.contact_type === 'whatsapp' ? (
                          <MessageCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Phone className="h-4 w-4 text-blue-500" />
                        )}
                        {lead.contact_type}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {lead.owner?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                      {formatDate(lead.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={lead.status} />
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
