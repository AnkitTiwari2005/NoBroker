import { Redirect } from 'expo-router'
import { useAuthStore } from '../src/store/authStore'
import { View, ActivityIndicator } from 'react-native'

export default function Index() {
  const { isInitialized } = useAuthStore()
  
  if (!isInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1E3A5F' }}>
        <ActivityIndicator size="large" color="#F59E0B" />
      </View>
    )
  }
  
  return <Redirect href="/(tabs)" />
}
