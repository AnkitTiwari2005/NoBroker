import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { useState } from 'react'
import { Button } from '../../src/components/ui/Button'
import { Input } from '../../src/components/ui/Input'
import { COLORS } from '../../src/config/constants'
import { useRouter } from 'expo-router'

export default function CreateListing() {
  const [step, setStep] = useState(1)
  const router = useRouter()
  
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Post New Property - Step {step}/3</Text>
      <ScrollView contentContainerStyle={styles.content}>
        
        {step === 1 && (
          <View>
            <Text style={styles.title}>Basic Info</Text>
            <Input placeholder="Property Title" />
            <Input placeholder="City" />
            <Input placeholder="Locality" />
            <Button title="Next" onPress={() => setStep(2)} />
          </View>
        )}
        
        {step === 2 && (
          <View>
            <Text style={styles.title}>Details</Text>
            <Input placeholder="Price / Rent" keyboardType="numeric" />
            <Input placeholder="Bedrooms" keyboardType="numeric" />
            <Input placeholder="Area (sq.ft)" keyboardType="numeric" />
            <View style={{ flexDirection: 'row', gap: 16, marginTop: 16 }}>
              <Button title="Back" variant="outline" onPress={() => setStep(1)} style={{ flex: 1 }} />
              <Button title="Next" onPress={() => setStep(3)} style={{ flex: 1 }} />
            </View>
          </View>
        )}
        
        {step === 3 && (
          <View>
            <Text style={styles.title}>Finalize</Text>
            <Input placeholder="Description" multiline style={{ height: 100 }} />
            <View style={{ flexDirection: 'row', gap: 16, marginTop: 16 }}>
              <Button title="Back" variant="outline" onPress={() => setStep(2)} style={{ flex: 1 }} />
              <Button title="Submit Listing" onPress={() => { alert('Listed successfully!'); router.push('/(tabs)') }} style={{ flex: 1 }} />
            </View>
          </View>
        )}
        
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, paddingTop: 48 },
  header: { fontSize: 16, fontWeight: 'bold', padding: 16, textAlign: 'center', borderBottomWidth: 1, borderBottomColor: COLORS.border },
  content: { padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 }
})
