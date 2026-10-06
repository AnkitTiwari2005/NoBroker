import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { useState } from 'react'
import { useRouter } from 'expo-router'
import { Input } from '../../src/components/ui/Input'
import { Button } from '../../src/components/ui/Button'
import { useAuthStore } from '../../src/store/authStore'
import { COLORS } from '../../src/config/constants'

export default function Register() {
  const [step, setStep] = useState(1)
  const [role, setRole] = useState<'seeker'|'owner'>('seeker')
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const { register, isLoading } = useAuthStore()
  const router = useRouter()

  const handleRegister = async () => {
    try {
      await register({ ...form, role })
      router.replace('/(tabs)')
    } catch (error) {
      alert('Registration failed')
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {step === 1 ? (
        <View>
          <Text style={styles.title}>I want to...</Text>
          <TouchableOpacity style={[styles.card, role==='seeker' && styles.cardActive]} onPress={() => setRole('seeker')}>
            <Text style={styles.icon}>🔍</Text>
            <Text style={styles.cardTitle}>Find a Property</Text>
            <Text style={styles.cardDesc}>Search, save & contact owners</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.card, role==='owner' && styles.cardActive]} onPress={() => setRole('owner')}>
            <Text style={styles.icon}>🏠</Text>
            <Text style={styles.cardTitle}>List my Property</Text>
            <Text style={styles.cardDesc}>Post listings & manage leads</Text>
          </TouchableOpacity>
          <Button title="Continue" onPress={() => setStep(2)} style={{ marginTop: 24 }} size="lg" />
        </View>
      ) : (
        <View>
          <TouchableOpacity onPress={() => setStep(1)}><Text style={styles.back}>← Back</Text></TouchableOpacity>
          <Text style={styles.title}>Your Details</Text>
          <Input placeholder="Full Name" value={form.name} onChangeText={t => setForm({...form, name: t})} />
          <Input placeholder="Phone Number" value={form.phone} onChangeText={t => setForm({...form, phone: t})} keyboardType="phone-pad" />
          <Input placeholder="Email" value={form.email} onChangeText={t => setForm({...form, email: t})} autoCapitalize="none" />
          <Input placeholder="Password" value={form.password} onChangeText={t => setForm({...form, password: t})} isPassword />
          <Button title="Create Account" onPress={handleRegister} loading={isLoading} size="lg" style={{ marginTop: 16 }} />
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: COLORS.bg, padding: 24, paddingTop: 64 },
  title: { fontSize: 28, fontWeight: 'bold', color: COLORS.text, marginBottom: 32 },
  card: { backgroundColor: COLORS.surface, padding: 24, borderRadius: 16, marginBottom: 16, borderWidth: 2, borderColor: 'transparent' },
  cardActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight + '10' },
  icon: { fontSize: 48, marginBottom: 12 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 4 },
  cardDesc: { color: COLORS.textSec },
  back: { color: COLORS.primary, marginBottom: 16, fontSize: 16, fontWeight: 'bold' }
})
