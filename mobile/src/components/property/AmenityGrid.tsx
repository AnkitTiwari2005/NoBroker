import { View, Text, StyleSheet } from 'react-native'
import { getAmenityLabel, getAmenityIcon } from '../../utils/format'
import { COLORS } from '../../config/constants'

export function AmenityGrid({ amenities }: { amenities: string[] }) {
  if (!amenities?.length) return null
  return (
    <View style={styles.container}>
      {amenities.map(a => (
        <View key={a} style={styles.item}>
          <Text style={styles.icon}>{getAmenityIcon(a)}</Text>
          <Text style={styles.label}>{getAmenityLabel(a)}</Text>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginVertical: 12 },
  item: { width: '30%', alignItems: 'center', backgroundColor: COLORS.surfaceAlt, padding: 12, borderRadius: 8 },
  icon: { fontSize: 24, marginBottom: 4 },
  label: { fontSize: 12, textAlign: 'center', color: COLORS.textSec }
})
