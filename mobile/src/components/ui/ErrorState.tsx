import { View, Text, StyleSheet } from 'react-native'
import { Button } from './Button'
import { COLORS } from '../../config/constants'

interface ErrorStateProps {
  message?: string
  onRetry: () => void
}

export function ErrorState({ message = 'Something went wrong. Please try again.', onRetry }: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⚠️</Text>
      <Text style={styles.title}>Oops!</Text>
      <Text style={styles.message}>{message}</Text>
      <Button title="Try Again" onPress={onRetry} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  icon: { fontSize: 48, marginBottom: 16 },
  title: { fontSize: 20, fontWeight: 'bold', color: COLORS.text, marginBottom: 8 },
  message: { fontSize: 16, color: COLORS.textSec, textAlign: 'center', marginBottom: 24 }
})
