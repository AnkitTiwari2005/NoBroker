import { View, Text, StyleSheet, ScrollView } from 'react-native'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import { forwardRef } from 'react'
import { Button } from '../ui/Button'
import { Chip } from '../ui/Chip'
import { SearchFilters } from '../../types'
import { COLORS } from '../../config/constants'

interface FilterSheetProps {
  filters: SearchFilters
  onUpdateFilter: (key: keyof SearchFilters, value: any) => void
  onClear: () => void
  onApply: () => void
}

export const FilterSheet = forwardRef<BottomSheet, FilterSheetProps>(({ filters, onUpdateFilter, onClear, onApply }, ref) => {
  const toggleArray = (key: keyof SearchFilters, item: any) => {
    const current = (filters[key] as any[]) || []
    if (current.includes(item)) {
      onUpdateFilter(key, current.filter(i => i !== item))
    } else {
      onUpdateFilter(key, [...current, item])
    }
  }

  return (
    <BottomSheet ref={ref} snapPoints={['90%']} index={-1} enablePanDownToClose>
      <View style={styles.header}>
        <Text style={styles.title}>Filters</Text>
      </View>
      <ScrollView style={styles.content}>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Listing Type</Text>
          <View style={styles.row}>
            {['buy', 'rent'].map(type => (
              <Chip 
                key={type} 
                label={type.toUpperCase()} 
                selected={filters.listingType === type} 
                onPress={() => onUpdateFilter('listingType', type)} 
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bedrooms</Text>
          <View style={styles.row}>
            {[1, 2, 3, 4, 5].map(b => (
              <Chip key={b} label={`${b} BHK`} selected={filters.bedrooms?.includes(b)} onPress={() => toggleArray('bedrooms', b)} />
            ))}
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property Type</Text>
          <View style={styles.row}>
            {['apartment', 'house', 'villa', 'builder_floor'].map(pt => (
              <Chip key={pt} label={pt.replace('_', ' ')} selected={filters.propertyType?.includes(pt as any)} onPress={() => toggleArray('propertyType', pt)} />
            ))}
          </View>
        </View>

      </ScrollView>
      <View style={styles.footer}>
        <Button title="Clear All" variant="ghost" onPress={onClear} style={{ flex: 1 }} />
        <Button title="Apply Filters" onPress={onApply} style={{ flex: 2 }} />
      </View>
    </BottomSheet>
  )
})

const styles = StyleSheet.create({
  header: { padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border, alignItems: 'center' },
  title: { fontSize: 18, fontWeight: 'bold' },
  content: { flex: 1, padding: 16 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  row: { flexDirection: 'row', flexWrap: 'wrap' },
  footer: { flexDirection: 'row', padding: 16, borderTopWidth: 1, borderTopColor: COLORS.border, backgroundColor: '#fff', gap: 12 }
})
