import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { Avatar } from '../../src/components/ui/Avatar'
import { Button } from '../../src/components/ui/Button'
import { EmptyState } from '../../src/components/ui/EmptyState'
import { useAuthStore } from '../../src/store/authStore'
import { useRouter } from 'expo-router'
import { COLORS } from '../../src/config/constants'

export default function AccountScreen() {
  const { user, logout } = useAuthStore()
  const router = useRouter()

  if (!user) return <EmptyState title="Sign in to NoBroker" subtitle="Access your saved properties, listings & more" buttonTitle="Login" onButtonPress={() => router.push('/(auth)/login')} />

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar name={user.name} url={user.avatarUrl} size={80} />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <Text style={styles.role}>{user.role.toUpperCase()}</Text>
      </View>

      <View style={styles.section}>
        <Button title="Logout" variant="danger" onPress={logout} style={{ marginTop: 24 }} />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { alignItems: 'center', padding: 32, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: COLORS.border, paddingTop: 64 },
  name: { fontSize: 24, fontWeight: 'bold', marginTop: 16 },
  email: { fontSize: 16, color: COLORS.textSec, marginTop: 4 },
  role: { fontSize: 12, backgroundColor: COLORS.primaryLight, color: '#fff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, marginTop: 8, overflow: 'hidden' },
  section: { padding: 24 }
})
