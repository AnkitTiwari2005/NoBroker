import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '../../config/constants'
import { useRouter } from 'expo-router'

export function HeroSection() {
  const router = useRouter()
  return (
    <LinearGradient colors={[COLORS.primary, '#2a5298']} style={styles.container}>
      <Text style={styles.title}>Find your perfect home</Text>
      <Text style={styles.subtitle}>Buy or Rent? We've got you covered</Text>
      
      <TouchableOpacity style={styles.searchBar} onPress={() => router.push('/search')} activeOpacity={0.9}>
        <Ionicons name="search" size={20} color={COLORS.textMuted} />
        <Text style={styles.searchText}>Search by city, locality...</Text>
      </TouchableOpacity>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingTop: 48, paddingBottom: 32 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.8)', marginBottom: 24 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 12, gap: 12 },
  searchText: { color: COLORS.textMuted, fontSize: 16 }
})
