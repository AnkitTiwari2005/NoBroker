import { ScrollView, StyleSheet } from 'react-native'
import { Chip } from '../ui/Chip'

export function QuickFilters({ onSelect }: { onSelect: (filter: any) => void }) {
  const filters = [
    { label: '1 BHK', value: { bedrooms: [1] } },
    { label: '2 BHK', value: { bedrooms: [2] } },
    { label: '3 BHK', value: { bedrooms: [3] } },
    { label: 'Villa', value: { propertyType: ['villa'] } },
    { label: 'Studio', value: { propertyType: ['studio'] } },
    { label: 'Plot', value: { propertyType: ['plot'] } },
  ]

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
      {filters.map(f => (
        <Chip key={f.label} label={f.label} onPress={() => onSelect(f.value)} />
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingVertical: 8, gap: 8 }
})
