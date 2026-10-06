import { Property } from './types'

// ─── Price Formatting ─────────────────────────────────────────────────────────
export function formatPrice(amount: number, type: 'buy' | 'rent'): string {
  if (type === 'rent') {
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L/mo`
    return `₹${amount.toLocaleString('en-IN')}/mo`
  }
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`
  return `₹${amount.toLocaleString('en-IN')}`
}

export function formatArea(sqft: number): string {
  return `${sqft.toLocaleString('en-IN')} sq.ft`
}

export function timeAgo(dateString: string): string {
  const now  = new Date()
  const date = new Date(dateString)
  const diffMs   = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffDays = Math.floor(diffMs / 86400000)
  if (diffMins < 60)  return `${diffMins}m ago`
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7)   return `${diffDays} days ago`
  if (diffDays < 30)  return `${Math.floor(diffDays / 7)} weeks ago`
  return `${Math.floor(diffDays / 30)} months ago`
}

export function formatPropertyType(type: string): string {
  const map: Record<string, string> = {
    apartment:     'Apartment',
    house:         'House',
    villa:         'Villa',
    builder_floor: 'Builder Floor',
    studio:        'Studio',
    plot:          'Plot',
    other:         'Other',
  }
  return map[type] || type
}

export function formatFurnishing(status: string): string {
  const map: Record<string, string> = {
    unfurnished:    'Unfurnished',
    semi_furnished: 'Semi Furnished',
    fully_furnished:'Fully Furnished',
  }
  return map[status] || status
}

export function getAmenityLabel(a: string): string {
  const map: Record<string, string> = {
    gym:          'Gym',
    pool:         'Pool',
    security:     'Security',
    lift:         'Lift',
    elevator:     'Elevator',
    power_backup: 'Power Backup',
    clubhouse:    'Clubhouse',
    garden:       'Garden',
    wifi:         'WiFi',
    ac:           'AC',
    intercom:     'Intercom',
    park:         'Play Area',
    cctv:         'CCTV',
    parking:      'Parking',
  }
  return map[a] || a.charAt(0).toUpperCase() + a.slice(1).replace(/_/g, ' ')
}

export function getDisplayPrice(property: Property): string {
  if (property.listingType === 'rent') {
    return formatPrice(property.monthlyRent || 0, 'rent')
  }
  return formatPrice(property.price || 0, 'buy')
}

export function maskOwnerName(name: string): string {
  const parts = name.split(' ')
  if (parts.length === 1) return parts[0]
  return `${parts[0]} ${parts[1][0]}.`
}

export function cleanPhone(phone?: string): string {
  if (!phone) return '9999999999'
  // Remove all non-digits, take last 10 digits
  const digits = phone.replace(/[^0-9]/g, '')
  return digits.slice(-10)
}

export function formatParking(parking?: string): string {
  const map: Record<string, string> = {
    none:    'None',
    covered: 'Covered',
    open:    'Open',
    both:    'Covered + Open',
  }
  return map[parking || 'none'] || 'None'
}

export function formatFacing(facing?: string): string {
  const map: Record<string, string> = {
    north:     'North',
    south:     'South',
    east:      'East',
    west:      'West',
    north_east:'North East',
    north_west:'North West',
    south_east:'South East',
    south_west:'South West',
  }
  return map[facing || ''] || 'Not Specified'
}

/** Copy text to clipboard, returns true on success */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

/** Open Google Maps for an address */
export function openMaps(address: string, city: string): void {
  const query = encodeURIComponent(`${address}, ${city}`)
  window.open(`https://maps.google.com/?q=${query}`, '_blank')
}
