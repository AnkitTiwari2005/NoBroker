import { View, Text } from 'react-native'
import { EmptyState } from '../src/components/ui/EmptyState'
import { useRouter } from 'expo-router'

export default function MyListings() {
  const router = useRouter()
  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <EmptyState title="No listings yet" subtitle="You haven't posted any properties." buttonTitle="Post Property" onButtonPress={() => router.push('/listing/create')} />
    </View>
  )
}
