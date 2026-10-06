import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import { COLORS } from '../../config/constants'

interface ChipProps {
  label: string
  selected?: boolean
  onPress?: () => void
}

export function Chip({ label, selected, onPress }: ChipProps) {
  return (
    <TouchableOpacity 
      style={[styles.chip, selected && styles.selectedChip]} 
      onPress={onPress}
      disabled={!onPress}
    >
      <Text style={[styles.text, selected && styles.selectedText]}>{label}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: COLORS.surfaceAlt, borderWidth: 1, borderColor: COLORS.border, marginRight: 8, marginBottom: 8 },
  selectedChip: { backgroundColor: COLORS.primaryLight, borderColor: COLORS.primary },
  text: { color: COLORS.textSec, fontSize: 14 },
  selectedText: { color: '#fff', fontWeight: 'bold' }
})
