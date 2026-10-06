import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { COLORS } from '../../config/constants'

const CATEGORIES = [
  { label: 'Apartment', icon: '🏢' },
  { label: 'Villa', icon: '🏡' },
  { label: 'House', icon: '🏠' },
  { label: 'Studio', icon: '🛋️' },
  { label: 'Plot', icon: '📐' },
  { label: 'Builder Floor', icon: '🏗️' },
]

export function CategoryGrid() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Browse by Type</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {CATEGORIES.map(c => (
          <TouchableOpacity key={c.label} style={styles.card}>
            <Text style={styles.icon}>{c.icon}</Text>
            <Text style={styles.label}>{c.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { paddingVertical: 16 },
  title: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, paddingHorizontal: 16, marginBottom: 16 },
  scroll: { paddingHorizontal: 16, gap: 16 },
  card: { width: 100, height: 100, backgroundColor: COLORS.surface, borderRadius: 12, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  icon: { fontSize: 32, marginBottom: 8 },
  label: { fontSize: 12, fontWeight: '500', color: COLORS.textSec, textAlign: 'center' }
})
