import { View } from 'react-native'
import { COLORS } from '../../config/constants'

export function Divider({ style }: { style?: any }) {
  return <View style={[{ height: 1, backgroundColor: COLORS.border, marginVertical: 16 }, style]} />
}
