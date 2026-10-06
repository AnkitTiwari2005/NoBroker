import { ScrollView, View, Text, StyleSheet, RefreshControl } from 'react-native'
import { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { HeroSection } from '../../src/components/home/HeroSection'
import { FeaturedSection } from '../../src/components/home/FeaturedSection'
import { CityGrid } from '../../src/components/home/CityGrid'
import { CategoryGrid } from '../../src/components/home/CategoryGrid'
import { PropertyCard } from '../../src/components/property/PropertyCard'
import { useProperties } from '../../src/hooks/useProperties'
import { COLORS } from '../../src/config/constants'

export default function Home() {
  const [refreshing, setRefreshing] = useState(false)
  const { data, refetch } = useProperties({})

  const onRefresh = async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }

  const recent = data?.pages?.[0]?.properties?.slice(0, 5) || []

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <View style={styles.header}>
        <Text style={styles.logo}>NoBroker</Text>
        <View style={styles.actions}>
          <View style={styles.locationPill}><Text style={styles.locationText}>Bangalore</Text></View>
          <Ionicons name="notifications-outline" size={24} color={COLORS.text} />
        </View>
      </View>

      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <HeroSection />
        <FeaturedSection />
        <CityGrid />
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Latest Properties</Text>
          {recent.map((p: any) => <PropertyCard key={p.id} property={p} />)}
        </View>

        <CategoryGrid />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 48, paddingBottom: 12, backgroundColor: '#fff' },
  logo: { fontSize: 24, fontWeight: 'bold', color: COLORS.primary },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  locationPill: { backgroundColor: COLORS.surfaceAlt, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  locationText: { fontSize: 12, fontWeight: '600' },
  section: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 16 }
})
