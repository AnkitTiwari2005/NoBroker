import { View, Text, StyleSheet } from 'react-native'
import { formatPrice } from '../../utils/format'
import { COLORS } from '../../config/constants'

export function PriceDisplay({ amount, type }: { amount: number, type: 'buy' | 'rent' }) {
  return (
    <View style={styles.container}>
      <Text style={[styles.price, { color: type === 'buy' ? COLORS.buyColor : COLORS.rentColor }]}>
        {formatPrice(amount, type)}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { marginBottom: 8 },
  price: { fontSize: 24, fontWeight: 'bold' }
})
