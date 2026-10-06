import { TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useFavoritesStore } from '../../store/favoritesStore'
import { COLORS } from '../../config/constants'

export function FavoriteButton({ propertyId, size = 24 }: { propertyId: string, size?: number }) {
  const isFavorited = useFavoritesStore(state => state.isFavorited(propertyId))
  const addFav = useFavoritesStore(state => state.addFavorite)
  const remFav = useFavoritesStore(state => state.removeFavorite)
  
  const toggle = () => {
    if (isFavorited) remFav(propertyId)
    else addFav(propertyId)
  }
  
  return (
    <TouchableOpacity style={styles.btn} onPress={toggle}>
      <Ionicons name={isFavorited ? 'heart' : 'heart-outline'} size={size} color={isFavorited ? COLORS.danger : '#fff'} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  btn: { backgroundColor: 'rgba(0,0,0,0.3)', padding: 8, borderRadius: 20 }
})
