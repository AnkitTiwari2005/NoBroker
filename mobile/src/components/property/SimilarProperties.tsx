import { View, Text, StyleSheet, FlatList } from 'react-native'
import { PropertyCard } from './PropertyCard'
import { Property } from '../../types'
import { COLORS } from '../../config/constants'

export function SimilarProperties({ properties }: { properties: Property[] }) {
  if (!properties?.length) return null
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Similar Properties</Text>
      <FlatList 
        horizontal 
        data={properties} 
        keyExtractor={p => p.id} 
        renderItem={({ item }) => <PropertyCard property={item} width={280} />} 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { marginVertical: 24 },
  title: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, paddingHorizontal: 16, marginBottom: 16 }
})
