'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Trash2, Check, X, Star } from 'lucide-react'
import StatusBadge from '@/components/admin/StatusBadge'
import { formatPrice } from '@/lib/utils'

export default function PropertyDetail({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [property, setProperty] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch(`/api/properties/${params.id}`)
      .then(res => res.json())
      .then(json => setProperty(json.data))
  }, [params.id])

  const handleUpdateStatus = async (status: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/properties/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      if (res.ok) {
        setProperty({ ...property, status })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this property?')) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/properties/${params.id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        router.push('/admin/properties')
      }
    } finally {
      setLoading(false)
    }
  }

  if (!property) return <div className="p-8">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/properties" className="p-2 hover:bg-slate-200 rounded-full transition-colors">
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </Link>
        <h2 className="text-2xl font-bold text-slate-800">Property Details</h2>
        <div className="ml-auto flex gap-3">
          {property.status === 'pending' && (
            <>
              <button 
                onClick={() => handleUpdateStatus('published')}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors"
              >
                <Check className="h-4 w-4 mr-2" />
                Approve
              </button>
              <button 
                onClick={() => handleUpdateStatus('rejected')}
                disabled={loading}
                className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg font-medium flex items-center transition-colors"
              >
                <X className="h-4 w-4 mr-2" />
                Reject
              </button>
            </>
          )}
          {property.status === 'published' && (
            <button 
              onClick={() => handleUpdateStatus('featured')}
              disabled={loading}
              className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg font-medium flex items-center transition-colors"
            >
              <Star className="h-4 w-4 mr-2" />
              Feature Listing
            </button>
          )}
          <button 
            onClick={handleDelete}
            disabled={loading}
            className="text-slate-400 hover:text-red-600 p-2 transition-colors ml-2"
            title="Delete Property"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">Title</label>
                <div className="text-slate-900 font-medium">{property.title}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">Property Type</label>
                  <div className="text-slate-900 capitalize">{property.property_type.replace('_', ' ')}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">Listing Type</label>
                  <div className="text-slate-900 capitalize">{property.listing_type}</div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">Description</label>
                <div className="text-slate-700 text-sm">{property.description || 'No description provided.'}</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Images</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {property.images?.map((img: any) => (
                <div key={img.id} className="aspect-video relative rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                  <img src={img.url} alt="Property" className="w-full h-full object-cover" />
                </div>
              ))}
              {(!property.images || property.images.length === 0) && (
                <div className="col-span-full py-8 text-center text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                  No images uploaded
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Status & Pricing</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <span className="text-slate-500 text-sm">Status</span>
                <StatusBadge status={property.status} />
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <span className="text-slate-500 text-sm">Price</span>
                <span className="font-semibold text-slate-900">
                  {formatPrice(property.listing_type === 'rent' ? property.monthly_rent : property.price)}
                </span>
              </div>
              {property.listing_type === 'rent' && (
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <span className="text-slate-500 text-sm">Security Deposit</span>
                  <span className="font-medium text-slate-700">{formatPrice(property.security_deposit)}</span>
                </div>
              )}
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <span className="text-slate-500 text-sm">Views</span>
                <span className="font-medium text-slate-700">{property.view_count}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Owner Information</h3>
            {property.owner ? (
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold">
                  {property.owner.name.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-slate-900">{property.owner.name}</div>
                  <div className="text-sm text-slate-500">{property.owner.is_verified ? 'Verified Owner' : 'Unverified Owner'}</div>
                </div>
              </div>
            ) : (
              <div className="text-slate-500 italic">No owner assigned</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
