import { View, Text, StyleSheet } from 'react-native'
import { Avatar } from '../ui/Avatar'
import { COLORS } from '../../config/constants'

export function OwnerCard({ owner }: { owner: { name: string, avatarUrl?: string, isVerified: boolean } }) {
  return (
    <View style={styles.card}>
      <Avatar name={owner.name} url={owner.avatarUrl} size={48} />
      <View style={styles.info}>
        <Text style={styles.name}>{owner.name}</Text>
        {owner.isVerified && <Text style={styles.badge}>✅ Verified Owner</Text>}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: COLORS.surfaceAlt, borderRadius: 12, marginVertical: 16 },
  info: { marginLeft: 16 },
  name: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
  badge: { fontSize: 12, color: COLORS.success, marginTop: 4 }
})
