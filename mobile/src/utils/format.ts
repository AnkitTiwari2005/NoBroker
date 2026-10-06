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
  const now = new Date()
  const date = new Date(dateString)
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return `${Math.floor(diffDays / 365)} years ago`
}

export function formatPropertyType(type: string): string {
  const map: Record<string, string> = {
    apartment: 'Apartment', house: 'House', villa: 'Villa',
    builder_floor: 'Builder Floor', studio: 'Studio',
    plot: 'Plot', other: 'Other'
  }
  return map[type] || type
}

export function formatFurnishing(status: string): string {
  const map: Record<string, string> = {
    unfurnished: 'Unfurnished',
    semi_furnished: 'Semi Furnished',
    fully_furnished: 'Fully Furnished'
  }
  return map[status] || status
}

export function getAmenityLabel(amenity: string): string {
  const map: Record<string, string> = {
    gym: 'Gym', pool: 'Swimming Pool', security: '24/7 Security',
    lift: 'Lift/Elevator', power_backup: 'Power Backup',
    clubhouse: 'Club House', garden: 'Garden/Park',
    wifi: 'WiFi', ac: 'Air Conditioning', intercom: 'Intercom',
    park: 'Children Play Area', cctv: 'CCTV'
  }
  return map[amenity] || amenity
}

export function getAmenityIcon(amenity: string): string {
  const map: Record<string, string> = {
    gym: '🏋️', pool: '🏊', security: '🔒', lift: '🛗',
    power_backup: '⚡', clubhouse: '🏛️', garden: '🌿',
    wifi: '📶', ac: '❄️', intercom: '📞', park: '🛝', cctv: '📷'
  }
  return map[amenity] || '✅'
}
