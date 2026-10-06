import { View, StyleSheet } from 'react-native'
import { FlashList } from '@shopify/flash-list'
import { PropertyCard } from '../../src/components/property/PropertyCard'
import { EmptyState } from '../../src/components/ui/EmptyState'
import { useFavorites } from '../../src/hooks/useFavorites'
import { useAuthStore } from '../../src/store/authStore'
import { useRouter } from 'expo-router'
import { COLORS } from '../../src/config/constants'

export default function FavoritesScreen() {
  const { user } = useAuthStore()
  const router = useRouter()
  const { data, isLoading } = useFavorites()

  if (!user) return <EmptyState title="Login to see saved properties" subtitle="Keep track of your favorite properties across all devices." buttonTitle="Login" onButtonPress={() => router.push('/(auth)/login')} />

  return (
    <View style={styles.container}>
      <FlashList
        data={data as any[] || []}
        renderItem={({ item }) => <View style={{ padding: 16 }}><PropertyCard property={item.property} /></View>}
        estimatedItemSize={300}
        ListEmptyComponent={<EmptyState title="No saved properties" subtitle="Start exploring and save your favorites here." buttonTitle="Browse Properties" onButtonPress={() => router.push('/search')} />}
      />
    </View>
  )
}

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: COLORS.bg, paddingTop: 48 } })
