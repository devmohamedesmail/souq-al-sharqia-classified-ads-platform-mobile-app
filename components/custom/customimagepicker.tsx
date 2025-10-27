import React, { useState } from 'react'
import { View, Text, Alert, TouchableOpacity, Image } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'

interface CustomImagePickerProps {
  label?: string
  placeholder?: string
  changeText?: string
  value?: string[] // <-- array of URIs
  onImageSelect: (imageUris: string[]) => void // <-- array of URIs
  error?: string
  touched?: boolean
  aspect?: [number, number]
  quality?: number
  allowsEditing?: boolean
}

export default function CustomImagePicker({
  label = "Image",
  placeholder = "Tap to select images",
  changeText = "Tap to change images",
  value,
  onImageSelect,
  error,
  touched,
  aspect = [1, 1],
  quality = 1,
  allowsEditing = false
}: CustomImagePickerProps) {
  const [selectedImages, setSelectedImages] = useState<string[]>(value || [])
  const { t,i18n } = useTranslation();

  const pickImages = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera roll is required!')
        return
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true, // <-- enable multiple
        allowsEditing,
        aspect,
        quality,
      })
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUris = result.assets.map(asset => asset.uri)
        setSelectedImages(imageUris)
        onImageSelect(imageUris)
      }
    } catch (error) {
      console.error('Error picking images:', error)
      Alert.alert('Error', 'Failed to pick images')
    }
  }

  const pickImageFromCamera = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync()
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera is required!')
        return
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing,
        aspect,
        quality,
      })
      if (!result.canceled && result.assets && result.assets[0]) {
        const imageUri = result.assets[0].uri
        const newImages = [...selectedImages, imageUri]
        setSelectedImages(newImages)
        onImageSelect(newImages)
      }
    } catch (error) {
      console.error('Error taking photo:', error)
      Alert.alert('Error', 'Failed to take photo')
    }
  }

  const showImageOptions = () => {
    Alert.alert(
      t('ad.select_image_method') || '',
      t('ad.choose_image_source') || '',
      [
        { text: t('ad.camera'), onPress: pickImageFromCamera },
        { text: t('ad.gallery'), onPress: pickImages },
        { text: t('ad.cancel'), style: 'cancel' }
      ]
    )
  }

  // Use value prop if provided, otherwise use internal state
  const displayImages = value || selectedImages

  return (
    <View className="mb-4">
      <Text
        className={`text-gray-700 text-base font-medium mb-2 ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}
        style={{ fontFamily: 'Cairo_600SemiBold' }}
      >
        {label}
      </Text>

      <TouchableOpacity
        onPress={showImageOptions}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 items-center justify-center min-h-[120px]"
      >
        {displayImages && displayImages.length > 0 ? (
          <View className="items-center">
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
              {displayImages.map((uri, idx) => (
                <Image
                  key={idx}
                  source={{ uri }}
                  className="w-20 h-20 rounded-lg mb-2 mr-2"
                  resizeMode="cover"
                />
              ))}
            </View>
            <Text
              className="text-blue-600 text-sm"
              style={{ fontFamily: 'Cairo_400Regular' }}
            >
              {changeText}
            </Text>
          </View>
        ) : (
          <View className="items-center">
            <Ionicons name="camera" size={32} color="#9CA3AF" />
            <Text
              className="text-gray-500 mt-2 text-center"
              style={{ fontFamily: 'Cairo_400Regular' }}
            >
              {placeholder}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {touched && error && (
        <Text
          className="text-red-500 mt-1 text-sm"
          style={{ fontFamily: 'Cairo_400Regular' }}
        >
          {error}
        </Text>
      )}
    </View>
  )
}