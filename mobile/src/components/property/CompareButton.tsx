import { TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useCompareStore } from '../../store/compareStore'
import { Property } from '../../types'
import { COLORS } from '../../config/constants'
import { Alert } from 'react-native'

export function CompareButton({ property, size = 24 }: { property: Property, size?: number }) {
  const isInCompare = useCompareStore(state => state.isInCompare(property.id))
  const addToCompare = useCompareStore(state => state.addToCompare)
  const remCompare = useCompareStore(state => state.removeFromCompare)
  
  const toggle = () => {
    if (isInCompare) {
      remCompare(property.id)
    } else {
      const added = addToCompare(property)
      if (!added) Alert.alert('Limit Reached', 'You can only compare up to 3 properties.')
    }
  }
  
  return (
    <TouchableOpacity style={styles.btn} onPress={toggle}>
      <Ionicons name="git-compare-outline" size={size} color={isInCompare ? COLORS.primary : COLORS.textSec} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  btn: { padding: 8, backgroundColor: COLORS.surfaceAlt, borderRadius: 20 }
})
