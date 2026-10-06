import { View, Text, StyleSheet } from 'react-native'
import { COLORS } from '../../config/constants'

interface BadgeProps {
  label: string
  color?: string
  backgroundColor?: string
}

export function Badge({ label, color = '#fff', backgroundColor = COLORS.primary }: BadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, alignSelf: 'flex-start' },
  text: { fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' }
})
