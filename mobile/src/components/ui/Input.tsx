import { TextInput, View, Text, TextInputProps, TouchableOpacity, StyleSheet } from 'react-native'
import { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '../../config/constants'

interface InputProps extends TextInputProps {
  label?: string
  error?: string
  leftIcon?: keyof typeof Ionicons.glyphMap
  isPassword?: boolean
}

export function Input({ label, error, leftIcon, isPassword, style, ...props }: InputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputContainer, isFocused && styles.focused, error && styles.error]}>
        {leftIcon && <Ionicons name={leftIcon} size={20} color={COLORS.textMuted} style={styles.icon} />}
        <TextInput
          style={[styles.input, style]}
          secureTextEntry={isPassword && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor={COLORS.textMuted}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.iconRight}>
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '500', color: COLORS.text, marginBottom: 8 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, backgroundColor: COLORS.surface, minHeight: 48 },
  focused: { borderColor: COLORS.primary },
  error: { borderColor: COLORS.danger },
  icon: { paddingLeft: 12 },
  iconRight: { paddingRight: 12 },
  input: { flex: 1, paddingHorizontal: 12, fontSize: 16, color: COLORS.text },
  errorText: { color: COLORS.danger, fontSize: 12, marginTop: 4 }
})
