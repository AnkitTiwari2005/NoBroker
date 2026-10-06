import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { SafeImage } from '../ui/SafeImage'
import { FavoriteButton } from './FavoriteButton'
import { StatusBadge } from './StatusBadge'
import { Property } from '../../types'
import { formatPrice, formatArea, formatPropertyType } from '../../utils/format'
import { COLORS } from '../../config/constants'
import { useRouter } from 'expo-router'

interface PropertyCardProps {
  property: Property
  width?: number
}

export function PropertyCard({ property, width }: PropertyCardProps) {
  const router = useRouter()
  
  return (
    <TouchableOpacity 
      style={[styles.card, width ? { width } : {}]}
      onPress={() => router.push(`/property/${property.id}`)}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <SafeImage source={{ uri: property.coverImageUrl }} style={styles.image} />
        <View style={styles.topRight}>
          <FavoriteButton propertyId={property.id} />
        </View>
        <View style={styles.topLeft}>
          <StatusBadge type={property.listingType} />
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.price, { color: property.listingType === 'buy' ? COLORS.buyColor : COLORS.rentColor }]}>
          {formatPrice(property.price || property.monthlyRent || 0, property.listingType)}
        </Text>
        <Text style={styles.title} numberOfLines={2}>{property.title}</Text>
        <Text style={styles.location}>📍 {property.locality}, {property.city}</Text>
        
        <View style={styles.specs}>
          <Text style={styles.spec}>🛏 {property.bedrooms} Beds</Text>
          <Text style={styles.spec}>🚿 {property.bathrooms} Baths</Text>
          <Text style={styles.spec}>📐 {formatArea(property.carpetArea || property.builtUpArea || 0)}</Text>
        </View>
        
        <View style={styles.chips}>
          <Text style={styles.chip}>{formatPropertyType(property.propertyType)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.surface, borderRadius: 12, overflow: 'hidden', marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  imageContainer: { height: 200, position: 'relative' },
  image: { width: '100%', height: '100%' },
  topRight: { position: 'absolute', top: 12, right: 12 },
  topLeft: { position: 'absolute', top: 12, left: 12 },
  content: { padding: 16 },
  price: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  title: { fontSize: 16, fontWeight: '600', color: COLORS.text, marginBottom: 4 },
  location: { fontSize: 14, color: COLORS.textSec, marginBottom: 12 },
  specs: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  spec: { fontSize: 12, color: COLORS.textSec, backgroundColor: COLORS.surfaceAlt, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  chips: { flexDirection: 'row' },
  chip: { fontSize: 12, color: COLORS.primary, borderWidth: 1, borderColor: COLORS.primary, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 }
})
