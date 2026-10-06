import { View, Text, StyleSheet } from 'react-native'
import { Button } from './Button'
import { COLORS } from '../../config/constants'

interface EmptyStateProps {
  emoji?: string
  title: string
  subtitle: string
  buttonTitle?: string
  onButtonPress?: () => void
}

export function EmptyState({ emoji = '😕', title, subtitle, buttonTitle, onButtonPress }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      {buttonTitle && onButtonPress && (
        <Button title={buttonTitle} onPress={onButtonPress} style={styles.button} />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  emoji: { fontSize: 64, marginBottom: 16 },
  title: { fontSize: 20, fontWeight: 'bold', color: COLORS.text, marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 16, color: COLORS.textSec, textAlign: 'center', marginBottom: 24, lineHeight: 24 },
  button: { minWidth: 200 }
})
