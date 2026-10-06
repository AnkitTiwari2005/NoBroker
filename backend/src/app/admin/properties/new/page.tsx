'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import { propertySchema } from '@/lib/validations'

export default function NewProperty() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    property_type: 'apartment',
    listing_type: 'rent',
    price: '',
    monthly_rent: '',
    security_deposit: '',
    address: '',
    city: '',
    locality: '',
    bedrooms: 0,
    bathrooms: 0,
    status: 'draft'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const dataToSubmit = {
        ...formData,
        price: formData.price ? parseInt(formData.price) : null,
        monthly_rent: formData.monthly_rent ? parseInt(formData.monthly_rent) : null,
        security_deposit: formData.security_deposit ? parseInt(formData.security_deposit) : null,
        bedrooms: parseInt(formData.bedrooms.toString()),
        bathrooms: parseInt(formData.bathrooms.toString()),
      }

      // We'd send it to a POST endpoint
      // const res = await fetch('/api/admin/properties', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(dataToSubmit)
      // })
      // if (res.ok) router.push('/admin/properties')

      // Mock success for now since we just created the table structure
      setTimeout(() => {
        router.push('/admin/properties')
      }, 500)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/properties" className="p-2 hover:bg-slate-200 rounded-full transition-colors">
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </Link>
        <h2 className="text-2xl font-bold text-slate-800">Add New Property</h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
        {error && <div className="p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-full">
            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input 
              required name="title" value={formData.title} onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="e.g. Luxurious 3 BHK in Koramangala" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Listing Type</label>
            <select 
              name="listing_type" value={formData.listing_type} onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="rent">For Rent</option>
              <option value="buy">For Sale</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Property Type</label>
            <select 
              name="property_type" value={formData.property_type} onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="apartment">Apartment</option>
              <option value="house">Independent House</option>
              <option value="villa">Villa</option>
              <option value="studio">Studio</option>
            </select>
          </div>

          <div className="col-span-full">
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Address</label>
            <input 
              required name="address" value={formData.address} onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
            <input 
              required name="city" value={formData.city} onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Locality</label>
            <input 
              required name="locality" value={formData.locality} onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>

          {formData.listing_type === 'rent' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Monthly Rent (₹)</label>
                <input 
                  type="number" required name="monthly_rent" value={formData.monthly_rent} onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Security Deposit (₹)</label>
                <input 
                  type="number" required name="security_deposit" value={formData.security_deposit} onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>
            </>
          ) : (
            <div className="col-span-full">
              <label className="block text-sm font-medium text-slate-700 mb-1">Sale Price (₹)</label>
              <input 
                type="number" required name="price" value={formData.price} onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
              />
            </div>
          )}

          <div className="col-span-full">
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea 
              name="description" value={formData.description} onChange={handleChange} rows={4}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 border-t border-slate-100 pt-6 mt-6">
          <Link href="/admin/properties" className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium">
            Cancel
          </Link>
          <button 
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : <><Save className="h-4 w-4 mr-2" /> Save Property</>}
          </button>
        </div>
      </form>
    </div>
  )
}
