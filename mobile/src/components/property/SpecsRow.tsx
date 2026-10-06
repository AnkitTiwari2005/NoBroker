import { View, Text, StyleSheet } from 'react-native'
import { COLORS } from '../../config/constants'

export function SpecsRow({ specs }: { specs: { icon: string, label: string }[] }) {
  return (
    <View style={styles.container}>
      {specs.map((spec, i) => (
        <View key={i} style={styles.item}>
          <Text style={styles.text}>{spec.icon} {spec.label}</Text>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginVertical: 8 },
  item: { backgroundColor: COLORS.surfaceAlt, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  text: { fontSize: 13, color: COLORS.textSec, fontWeight: '500' }
})
