import { View, Text, StyleSheet, Linking, TouchableOpacity } from 'react-native'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import { forwardRef } from 'react'
import { Button } from '../ui/Button'
import { COLORS } from '../../config/constants'

export const ContactSheet = forwardRef<BottomSheet, { ownerPhone: string }>((props, ref) => {
  const call = () => Linking.openURL(`tel:${props.ownerPhone}`)
  const whatsapp = () => Linking.openURL(`whatsapp://send?phone=${props.ownerPhone}`)

  return (
    <BottomSheet ref={ref} snapPoints={['30%']} index={-1} enablePanDownToClose>
      <BottomSheetView style={styles.content}>
        <Text style={styles.title}>Contact Owner</Text>
        <Text style={styles.phone}>{props.ownerPhone}</Text>
        <View style={styles.buttons}>
          <Button title="Call Now" onPress={call} style={styles.btn} />
          <Button title="WhatsApp" variant="secondary" onPress={whatsapp} style={styles.btn} />
        </View>
      </BottomSheetView>
    </BottomSheet>
  )
})

const styles = StyleSheet.create({
  content: { flex: 1, padding: 24, alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  phone: { fontSize: 18, color: COLORS.textSec, marginBottom: 24 },
  buttons: { flexDirection: 'row', gap: 16, width: '100%' },
  btn: { flex: 1 }
})
