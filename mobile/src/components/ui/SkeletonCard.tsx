import { View, StyleSheet, Animated } from 'react-native'
import { useEffect, useRef } from 'react'
import { COLORS } from '../../config/constants'

export function SkeletonCard() {
  const anim = useRef(new Animated.Value(0.5)).current
  
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0.5, duration: 1000, useNativeDriver: true })
      ])
    ).start()
  }, [])
  
  return (
    <Animated.View style={[styles.card, { opacity: anim }]}>
      <View style={styles.image} />
      <View style={styles.content}>
        <View style={styles.line1} />
        <View style={styles.line2} />
        <View style={styles.line3} />
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.surface, borderRadius: 12, overflow: 'hidden', marginBottom: 16, marginHorizontal: 16, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  image: { height: 200, backgroundColor: COLORS.surfaceAlt },
  content: { padding: 12, gap: 8 },
  line1: { height: 24, width: '40%', backgroundColor: COLORS.surfaceAlt, borderRadius: 4 },
  line2: { height: 20, width: '80%', backgroundColor: COLORS.surfaceAlt, borderRadius: 4 },
  line3: { height: 16, width: '60%', backgroundColor: COLORS.surfaceAlt, borderRadius: 4 }
})
