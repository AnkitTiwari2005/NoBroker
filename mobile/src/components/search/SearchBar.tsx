import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '../../config/constants'

interface SearchBarProps {
  value: string
  onChangeText: (t: string) => void
  onFilterPress: () => void
  onBackPress?: () => void
  filterCount?: number
}

export function SearchBar({ value, onChangeText, onFilterPress, onBackPress, filterCount = 0 }: SearchBarProps) {
  return (
    <View style={styles.container}>
      {onBackPress && (
        <TouchableOpacity style={styles.back} onPress={onBackPress}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
      )}
      <View style={styles.inputContainer}>
        <Ionicons name="search" size={20} color={COLORS.textMuted} style={styles.searchIcon} />
        <TextInput 
          style={styles.input} 
          placeholder="Search city, locality..." 
          value={value} 
          onChangeText={onChangeText} 
          placeholderTextColor={COLORS.textMuted}
        />
      </View>
      <TouchableOpacity style={styles.filterBtn} onPress={onFilterPress}>
        <Ionicons name="options" size={24} color={COLORS.primary} />
        {filterCount > 0 && <View style={styles.badge} />}
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff' },
  back: { marginRight: 12 },
  inputContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surfaceAlt, borderRadius: 8, paddingHorizontal: 12 },
  searchIcon: { marginRight: 8 },
  input: { flex: 1, height: 48, fontSize: 16, color: COLORS.text },
  filterBtn: { marginLeft: 12, padding: 8, position: 'relative' },
  badge: { position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.accent }
})
