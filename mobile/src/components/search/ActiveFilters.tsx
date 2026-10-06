import { ScrollView, View, StyleSheet } from 'react-native'
import { Chip } from '../ui/Chip'
import { SearchFilters } from '../../types'

export function ActiveFilters({ filters, onRemove }: { filters: SearchFilters, onRemove: (k: keyof SearchFilters, v?: any) => void }) {
  const active: { label: string, key: keyof SearchFilters, val: any }[] = []
  
  if (filters.listingType) active.push({ label: filters.listingType, key: 'listingType', val: filters.listingType })
  if (filters.city) active.push({ label: filters.city, key: 'city', val: filters.city })
  filters.bedrooms?.forEach(b => active.push({ label: `${b} BHK`, key: 'bedrooms', val: b }))
  filters.propertyType?.forEach(pt => active.push({ label: pt, key: 'propertyType', val: pt }))

  if (active.length === 0) return null

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container} contentContainerStyle={styles.content}>
      {active.map((a, i) => (
        <Chip key={i} label={`${a.label} ✕`} selected onPress={() => onRemove(a.key, a.val)} />
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { maxHeight: 50 },
  content: { paddingHorizontal: 16, alignItems: 'center' }
})
