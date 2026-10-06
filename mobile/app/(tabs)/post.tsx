import { View } from 'react-native'
import { EmptyState } from '../../src/components/ui/EmptyState'
import { useAuthStore } from '../../src/store/authStore'
import { useRouter } from 'expo-router'

export default function PostProperty() {
  const { user } = useAuthStore()
  const router = useRouter()

  if (!user) {
    return <EmptyState title="List your property for FREE" subtitle="Sign in to post your property and connect with buyers/tenants directly." buttonTitle="Login" onButtonPress={() => router.push('/(auth)/login')} />
  }

  if (user.role === 'seeker') {
    return <EmptyState title="Switch to Owner" subtitle="You are currently registered as a seeker. Please contact support to upgrade your account to list properties." />
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <EmptyState title="Manage Listings" subtitle="Post a new property or manage your existing listings." buttonTitle="+ Post New Property" onButtonPress={() => router.push('/listing/create')} />
    </View>
  )
}
