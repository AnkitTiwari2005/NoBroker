import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { useState } from 'react'
import { useRouter, Link } from 'expo-router'
import { Input } from '../../src/components/ui/Input'
import { Button } from '../../src/components/ui/Button'
import { useAuthStore } from '../../src/store/authStore'
import { COLORS } from '../../src/config/constants'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login, isLoading } = useAuthStore()
  const router = useRouter()

  const handleLogin = async () => {
    if (!email || !password) return setError('Please fill all fields')
    try {
      await login(email, password)
      router.replace('/(tabs)')
    } catch (e: any) {
      setError(e.message)
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.logo}>NoBroker</Text>
        <Text style={styles.tagline}>Find your perfect home</Text>
        
        <View style={styles.card}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Log in to continue</Text>
          
          {error ? <Text style={styles.error}>{error}</Text> : null}
          
          <Input 
            leftIcon="mail" 
            placeholder="Email Address" 
            value={email} 
            onChangeText={setEmail} 
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <Input 
            leftIcon="lock-closed" 
            placeholder="Password" 
            value={password} 
            onChangeText={setPassword} 
            isPassword
          />
          
          <Link href="/(auth)/register" style={styles.forgot}>Forgot password?</Link>
          
          <Button title="Login" onPress={handleLogin} loading={isLoading} fullWidth size="lg" />
          
          <View style={styles.divider}><Text style={styles.dividerText}>OR</Text></View>
          
          <Link href="/(auth)/register" style={styles.register}>
            <Text style={{ color: COLORS.textSec }}>Don't have an account? </Text>
            <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>Register</Text>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: COLORS.bg, justifyContent: 'center', padding: 24 },
  logo: { fontSize: 32, fontWeight: 'bold', color: COLORS.primary, textAlign: 'center', marginBottom: 8 },
  tagline: { fontSize: 16, color: COLORS.textSec, textAlign: 'center', marginBottom: 48 },
  card: { backgroundColor: COLORS.surface, padding: 24, borderRadius: 24, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 16, elevation: 5 },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.text, marginBottom: 8 },
  subtitle: { fontSize: 16, color: COLORS.textSec, marginBottom: 24 },
  forgot: { textAlign: 'right', color: COLORS.primary, marginBottom: 24, fontWeight: '500' },
  divider: { marginVertical: 24, alignItems: 'center' },
  dividerText: { color: COLORS.textMuted, backgroundColor: COLORS.surface, paddingHorizontal: 16 },
  register: { textAlign: 'center', marginTop: 8 },
  error: { color: COLORS.danger, marginBottom: 16, textAlign: 'center' }
})
