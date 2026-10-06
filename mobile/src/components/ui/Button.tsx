import { TouchableOpacity, Text, ActivityIndicator, ViewStyle, TextStyle } from 'react-native'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps {
  title: string
  onPress: () => void
  variant?: Variant
  size?: Size
  loading?: boolean
  disabled?: boolean
  style?: ViewStyle
  textStyle?: TextStyle
  fullWidth?: boolean
}

const COLORS = { primary: '#1E3A5F', accent: '#F59E0B', danger: '#EF4444' }

export function Button({ title, onPress, variant = 'primary', size = 'md', loading, disabled, style, textStyle, fullWidth }: ButtonProps) {
  const getContainerStyle = () => {
    const base: ViewStyle = {
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: 8,
      opacity: disabled || loading ? 0.6 : 1,
      ...(fullWidth && { width: '100%' }),
    }
    const sizeStyle: ViewStyle = size === 'sm' ? { paddingVertical: 8, paddingHorizontal: 16 } : size === 'lg' ? { paddingVertical: 16, paddingHorizontal: 24 } : { paddingVertical: 12, paddingHorizontal: 20 }
    const variantStyle: ViewStyle = variant === 'primary' ? { backgroundColor: COLORS.primary } : variant === 'secondary' ? { backgroundColor: COLORS.accent } : variant === 'outline' ? { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: COLORS.primary } : variant === 'danger' ? { backgroundColor: COLORS.danger } : { backgroundColor: 'transparent' }
    return [base, sizeStyle, variantStyle, style]
  }
  
  const getTextStyle = (): TextStyle => {
    const sizeStyle: TextStyle = size === 'sm' ? { fontSize: 13 } : size === 'lg' ? { fontSize: 17 } : { fontSize: 15 }
    const variantStyle: TextStyle = variant === 'outline' || variant === 'ghost' ? { color: COLORS.primary } : { color: '#fff' }
    const base: TextStyle = { fontWeight: '600' }
    return { ...base, ...sizeStyle, ...variantStyle, ...textStyle }
  }
  
  return (
    <TouchableOpacity style={getContainerStyle()} onPress={onPress} disabled={disabled || loading} activeOpacity={0.8}>
      {loading && <ActivityIndicator size="small" color={variant === 'outline' ? COLORS.primary : '#fff'} />}
      <Text style={getTextStyle()}>{title}</Text>
    </TouchableOpacity>
  )
}
