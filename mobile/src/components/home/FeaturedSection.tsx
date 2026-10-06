import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import { PropertyCard } from '../property/PropertyCard'
import { PropertyCardSkeleton } from '../property/PropertyCardSkeleton'
import { useFeaturedProperties } from '../../hooks/useFeaturedProperties'
import { COLORS } from '../../config/constants'

export function FeaturedSection() {
  const { data, isLoading } = useFeaturedProperties()

  if (isLoading) return <View style={styles.container}><PropertyCardSkeleton /><PropertyCardSkeleton /></View>
  if (!data?.length) return null

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Featured Properties</Text>
        <TouchableOpacity><Text style={styles.link}>See all</Text></TouchableOpacity>
      </View>
      <FlatList 
        horizontal 
        data={data as any} 
        keyExtractor={item => item.id} 
        renderItem={({ item }) => <PropertyCard property={item} width={300} />}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { marginVertical: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 16 },
  title: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
  link: { color: COLORS.primary, fontWeight: '600' },
  list: { paddingHorizontal: 16, gap: 16 }
})
