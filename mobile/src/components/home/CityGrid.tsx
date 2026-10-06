import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { SafeImage } from '../ui/SafeImage'
import { COLORS } from '../../config/constants'

const CITIES = [
  { name: 'Bangalore', img: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=400' },
  { name: 'Mumbai', img: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=400' },
  { name: 'Delhi', img: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400' },
  { name: 'Hyderabad', img: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400' },
  { name: 'Chennai', img: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400' },
  { name: 'Pune', img: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400' },
]

export function CityGrid() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explore by City</Text>
      <View style={styles.grid}>
        {CITIES.map(c => (
          <TouchableOpacity key={c.name} style={styles.card}>
            <SafeImage source={{ uri: c.img }} style={styles.image} />
            <View style={styles.overlay} />
            <Text style={styles.name}>{c.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between' },
  card: { width: '48%', height: 100, borderRadius: 8, overflow: 'hidden', position: 'relative' },
  image: { width: '100%', height: '100%' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)' },
  name: { position: 'absolute', bottom: 12, left: 12, color: '#fff', fontWeight: 'bold', fontSize: 16 }
})
