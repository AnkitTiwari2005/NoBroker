import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { useCompareStore } from '../src/store/compareStore'
import { EmptyState } from '../src/components/ui/EmptyState'
import { useRouter } from 'expo-router'
import { SafeImage } from '../src/components/ui/SafeImage'
import { COLORS } from '../src/config/constants'

export default function CompareScreen() {
  const { compareList, removeFromCompare, clearCompare } = useCompareStore()
  const router = useRouter()

  if (compareList.length === 0) {
    return <EmptyState title="Nothing to compare" subtitle="Add properties to compare by tapping the compare icon." buttonTitle="Browse" onButtonPress={() => router.back()} />
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Compare Properties ({compareList.length}/3)</Text>
      
      <ScrollView horizontal style={styles.scroll}>
        <View style={styles.labels}>
          <Text style={styles.label}>Image</Text>
          <Text style={styles.label}>Price</Text>
          <Text style={styles.label}>Beds</Text>
          <Text style={styles.label}>Area</Text>
        </View>

        {compareList.map(p => (
          <View key={p.id} style={styles.col}>
            <View style={{ height: 50, justifyContent: 'center' }}>
              <TouchableOpacity onPress={() => removeFromCompare(p.id)}><Text style={{ color: 'red' }}>Remove</Text></TouchableOpacity>
            </View>
            <View style={styles.cell}><SafeImage source={{ uri: p.coverImageUrl }} style={{ width: 80, height: 50 }} /></View>
            <View style={styles.cell}><Text style={styles.val}>{p.price || p.monthlyRent}</Text></View>
            <View style={styles.cell}><Text style={styles.val}>{p.bedrooms}</Text></View>
            <View style={styles.cell}><Text style={styles.val}>{p.carpetArea}</Text></View>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, paddingTop: 64 },
  title: { fontSize: 20, fontWeight: 'bold', padding: 16 },
  scroll: { flexDirection: 'row' },
  labels: { width: 80, backgroundColor: COLORS.surfaceAlt },
  label: { height: 60, padding: 8, justifyContent: 'center', fontWeight: 'bold' },
  col: { width: 120, borderLeftWidth: 1, borderColor: COLORS.border },
  cell: { height: 60, padding: 8, justifyContent: 'center' },
  val: { fontSize: 14 }
})
