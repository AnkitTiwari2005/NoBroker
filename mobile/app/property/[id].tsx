import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useRef, useState } from 'react'
import BottomSheet from '@gorhom/bottom-sheet'
import { Ionicons } from '@expo/vector-icons'
import { SafeImage } from '../../src/components/ui/SafeImage'
import { FavoriteButton } from '../../src/components/property/FavoriteButton'
import { CompareButton } from '../../src/components/property/CompareButton'
import { PriceDisplay } from '../../src/components/property/PriceDisplay'
import { SpecsRow } from '../../src/components/property/SpecsRow'
import { AmenityGrid } from '../../src/components/property/AmenityGrid'
import { OwnerCard } from '../../src/components/property/OwnerCard'
import { ContactSheet } from '../../src/components/property/ContactSheet'
import { StatusBadge } from '../../src/components/property/StatusBadge'
import { useProperty } from '../../src/hooks/useProperty'
import { useCreateLead } from '../../src/hooks/useLeads'
import { COLORS } from '../../src/config/constants'
import { formatArea } from '../../src/utils/format'

export default function PropertyDetail() {
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const { data: property, isLoading, error } = useProperty(id as string)
  const contactSheetRef = useRef<BottomSheet>(null)
  const leadMutation = useCreateLead()

  if (isLoading) return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />
  if (error || !property) return <Text style={{ flex: 1, textAlign: 'center', marginTop: 40 }}>Property not found.</Text>

  const specs = [
    { icon: '🛏️', label: `${property.bedrooms} Beds` },
    { icon: '🚿', label: `${property.bathrooms} Baths` },
    { icon: '📐', label: formatArea(property.carpetArea || property.builtUpArea || 0) },
    { icon: '🏢', label: `Floor ${property.floorNumber}/${property.totalFloors}` },
  ]

  const handleContact = async () => {
    try {
      await leadMutation.mutateAsync({ propertyId: property.id, contactType: 'phone', userName: 'User', userPhone: '1234567890' })
      contactSheetRef.current?.expand()
    } catch (e) {
      alert('Could not contact owner. Please login.')
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* IMAGE GALLERY */}
        <View style={styles.gallery}>
          <SafeImage source={{ uri: property.coverImageUrl }} style={styles.image} />
          
          <View style={styles.topBtns}>
            <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}><Ionicons name="arrow-back" size={24} color="#fff" /></TouchableOpacity>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <FavoriteButton propertyId={property.id} size={24} />
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.badges}>
            <StatusBadge type={property.listingType} />
            {property.isVerified && <Text style={styles.verified}>✅ Verified</Text>}
          </View>

          <PriceDisplay amount={property.price || property.monthlyRent || 0} type={property.listingType} />
          <Text style={styles.title}>{property.title}</Text>
          <Text style={styles.location}>📍 {property.locality}, {property.city}</Text>

          <SpecsRow specs={specs} />

          <View style={styles.quickInfo}>
            <View style={styles.infoCol}><Text style={styles.infoLabel}>Type</Text><Text style={styles.infoVal}>{property.propertyType}</Text></View>
            <View style={styles.infoCol}><Text style={styles.infoLabel}>Furnishing</Text><Text style={styles.infoVal}>{property.furnishingStatus}</Text></View>
          </View>

          <Text style={styles.sectionTitle}>About this property</Text>
          <Text style={styles.desc}>{property.description}</Text>

          <Text style={styles.sectionTitle}>Amenities</Text>
          <AmenityGrid amenities={property.amenities || []} />

          {property.owner && <OwnerCard owner={property.owner} />}
        </View>

      </ScrollView>

      {/* FIXED CONTACT BAR */}
      <View style={styles.bottomBar}>
        <View style={styles.barActions}>
          <FavoriteButton propertyId={property.id} />
          <CompareButton property={property} />
        </View>
        <TouchableOpacity style={styles.contactBtn} onPress={handleContact}>
          <Text style={styles.contactBtnTxt}>Contact Owner</Text>
        </TouchableOpacity>
      </View>

      <ContactSheet ref={contactSheetRef} ownerPhone={property.owner?.phone || '+91 9999999999'} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  gallery: { height: 280, width: '100%', position: 'relative' },
  image: { width: '100%', height: '100%' },
  topBtns: { position: 'absolute', top: 48, left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between' },
  iconBtn: { backgroundColor: 'rgba(0,0,0,0.3)', padding: 8, borderRadius: 20 },
  content: { padding: 16 },
  badges: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  verified: { color: COLORS.success, fontWeight: 'bold' },
  title: { fontSize: 20, fontWeight: 'bold', color: COLORS.text, marginBottom: 8 },
  location: { fontSize: 14, color: COLORS.textSec, marginBottom: 16 },
  quickInfo: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginVertical: 16, padding: 16, backgroundColor: COLORS.surfaceAlt, borderRadius: 8 },
  infoCol: { width: '45%' },
  infoLabel: { fontSize: 12, color: COLORS.textSec },
  infoVal: { fontSize: 14, fontWeight: 'bold', color: COLORS.text },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 12, color: COLORS.text },
  desc: { fontSize: 14, color: COLORS.textSec, lineHeight: 22 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', padding: 16, flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: COLORS.border, elevation: 10 },
  barActions: { flexDirection: 'row', gap: 12 },
  contactBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 32, paddingVertical: 12, borderRadius: 8 },
  contactBtnTxt: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
})
