import React from 'react'
import { useTranslation } from 'react-i18next'
import { Text, View, TextInput } from 'react-native'

interface CustomTextAreaProps {
  label?: string
  placeholder?: string
  value: string
  onChangeText: (text: string) => void
  error?: string
  touched?: boolean
  maxLength?: number
  numberOfLines?: number
  height?: number
  editable?: boolean
}

export default function CustomTextArea({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  touched,
  maxLength = 200,
  numberOfLines = 4,
  height = 100,
  editable = true
}: CustomTextAreaProps) {



  const { t, i18n } = useTranslation();






  return (
    <View className="mb-4">
      {label && (
        <Text
          className={`text-gray-700 text-base font-medium mb-2 ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}
          style={{ fontFamily: 'Cairo_600SemiBold' }}
        >
          {label}
        </Text>
      )}

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        multiline={true}
        numberOfLines={numberOfLines}
        maxLength={maxLength}
        editable={editable}
        textAlignVertical="top"
        className={`border text-right border-gray-400 rounded-lg px-4 py-3 text-gray-800 ${touched && error ? 'border-red-500' : 'border-gray-300'
          }`}
        style={{
          fontFamily: 'Cairo_400Regular',
          height: height,
          fontSize: 16
        }}
      />

      {/* Character count */}
      <View className="flex-row justify-between items-center mt-1">
        <View>
          { error && (
            <Text
              className="text-red-500 text-sm"
              style={{ fontFamily: 'Cairo_400Regular' }}
            >
              {error} 
            </Text>
          )}
        </View>

        <Text
          className="text-gray-400 text-sm"
          style={{ fontFamily: 'Cairo_400Regular' }}
        >
          {value.length}/{maxLength}
        </Text>
      </View>
    </View>
  )
}
