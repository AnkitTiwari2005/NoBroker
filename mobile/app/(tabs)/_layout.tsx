import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { View } from 'react-native'
import { useFavoritesStore } from '../../src/store/favoritesStore'
import { COLORS } from '../../src/config/constants'

export default function TabsLayout() {
  const favoriteIds = useFavoritesStore(state => state.favoriteIds)
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} /> }} />
      <Tabs.Screen name="search" options={{ title: 'Search', tabBarIcon: ({ color, size }) => <Ionicons name="search" size={size} color={color} /> }} />
      <Tabs.Screen name="post" options={{
        title: 'Post',
        tabBarIcon: () => (
          <View style={{ backgroundColor: COLORS.primary, width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
            <Ionicons name="add" size={28} color="#fff" />
          </View>
        ),
      }} />
      <Tabs.Screen name="favorites" options={{
        title: 'Saved',
        tabBarIcon: ({ color, size }) => <Ionicons name="heart" size={size} color={color} />,
        tabBarBadge: favoriteIds.size > 0 ? favoriteIds.size : undefined,
        tabBarBadgeStyle: { backgroundColor: COLORS.accent },
      }} />
      <Tabs.Screen name="account" options={{ title: 'Account', tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} /> }} />
    </Tabs>
  )
}
