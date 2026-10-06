import { View, StyleSheet, ActivityIndicator } from 'react-native'
import { useRef } from 'react'
import BottomSheet from '@gorhom/bottom-sheet'
import { FlashList } from '@shopify/flash-list'
import { SearchBar } from '../../src/components/search/SearchBar'
import { FilterSheet } from '../../src/components/search/FilterSheet'
import { ActiveFilters } from '../../src/components/search/ActiveFilters'
import { PropertyCard } from '../../src/components/property/PropertyCard'
import { EmptyState } from '../../src/components/ui/EmptyState'
import { useSearch } from '../../src/hooks/useSearch'
import { useProperties } from '../../src/hooks/useProperties'
import { COLORS } from '../../src/config/constants'

export default function SearchScreen() {
  const { query, setQuery, filters, updateFilter, clearFilters, activeFilterCount } = useSearch()
  const sheetRef = useRef<BottomSheet>(null)
  
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useProperties({ ...filters, city: query })

  const properties = data?.pages.flatMap(p => p.properties) || []

  return (
    <View style={styles.container}>
      <View style={{ paddingTop: 48, backgroundColor: '#fff' }}>
        <SearchBar 
          value={query} 
          onChangeText={setQuery} 
          onFilterPress={() => sheetRef.current?.expand()} 
          filterCount={activeFilterCount}
        />
        <ActiveFilters filters={filters} onRemove={(k) => updateFilter(k, undefined)} />
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlashList
          data={properties}
          renderItem={({ item }) => <View style={{ paddingHorizontal: 16, paddingTop: 16 }}><PropertyCard property={item} /></View>}
          estimatedItemSize={300}
          onEndReached={() => hasNextPage && fetchNextPage()}
          ListEmptyComponent={<EmptyState title="No properties found" subtitle="Try adjusting your filters" buttonTitle="Clear Filters" onButtonPress={clearFilters} />}
          ListFooterComponent={isFetchingNextPage ? <ActivityIndicator style={{ padding: 16 }} /> : null}
        />
      )}

      <FilterSheet 
        ref={sheetRef} 
        filters={filters} 
        onUpdateFilter={updateFilter} 
        onClear={clearFilters} 
        onApply={() => sheetRef.current?.close()} 
      />
    </View>
  )
}

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: COLORS.bg } })
