import { View, Text, StyleSheet } from 'react-native'
import { Image } from 'expo-image'
import { COLORS } from '../../config/constants'

interface AvatarProps {
  url?: string
  name: string
  size?: number
}

export function Avatar({ url, name, size = 48 }: AvatarProps) {
  const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
  
  if (url) {
    return <Image source={{ uri: url }} style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]} />
  }
  
  return (
    <View style={[styles.placeholder, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[styles.text, { fontSize: size / 2.5 }]}>{initials}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  image: { backgroundColor: COLORS.surfaceAlt },
  placeholder: { backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center' },
  text: { color: '#fff', fontWeight: 'bold' }
})
