import CustomButton from '@/components/custom/custombutton'
import CustomInput from '@/components/custom/custominput'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import { Toast } from 'toastify-react-native'
import axios from 'axios'
import CustomHeader from '@/components/custom/customheader'
import CustomImagePicker from '@/components/custom/customimagepicker'

export default function AddMeal() {
  const { t } = useTranslation()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // Validation schema
  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .required('Meal title is required')
      .min(2, 'Title must be at least 2 characters'),
    description: Yup.string()
      .required('Description is required')
      .min(10, 'Description must be at least 10 characters'),
    price: Yup.number()
      .required('Price is required')
      .positive('Price must be positive')
      .typeError('Please enter a valid price'),
    image: Yup.string()
      .required('Meal image is required')
  })

  const pickImage = async (setFieldValue: (field: string, value: string) => void) => {
    try {
      // Request permission
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()

      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera roll is required!')
        return
      }

      // Pick image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      })

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri
        setSelectedImage(imageUri)
        setFieldValue('image', imageUri)
      }
    } catch (error) {
      console.error('Error picking image:', error)
      Alert.alert('Error', 'Failed to pick image')
    }
  }

  const formik = useFormik({
    initialValues: {
      restaurant_id: '2',
      title: '',
      description: '',
      price: '',
      image: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true)
    
      try {
        // Create FormData for file upload - backend expects 'image' field name
        const formData = new FormData()
        
        // Add form fields
        formData.append('restaurant_id', '2')
        formData.append('title', values.title)
        formData.append('description', values.description)
        formData.append('price', values.price)

        // Add image file if selected
        if (selectedImage) {
          const filename = selectedImage.split('/').pop() || 'meal.jpg'
          const match = /\.(\w+)$/.exec(filename)
          const type = match ? `image/${match[1]}` : 'image/jpeg'
          
          const imageFile = {
            uri: selectedImage,
            name: filename,
            type: type,
          } as any
          
          formData.append('image', imageFile) // Changed from 'file' to 'image' to match backend
        }

        console.log('Submitting meal with FormData - using correct field name')
        
        const response = await axios.post(
          'https://uber-express-project.onrender.com/api/menu/create',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        )
        
        console.log('Meal added with Cloudinary URL:', response.data)
        Toast.success('Meal added successfully!')
        router.back()
      } catch (error: any) {
        console.error('Full error:', error)
        console.error('Error response:', error.response?.data)
        console.error('Error status:', error.response?.status)
        console.error('Error config:', error.config)
        console.error('Error request:', error.request)
        
        // Log the actual backend error message
        if (error.response?.data) {
          console.error('Backend error details:', JSON.stringify(error.response.data, null, 2))
        }
        
        console.error('Error adding meal:', error)
        Toast.error(error.response?.data?.message || 'Failed to add meal')
      } finally {
        setIsSubmitting(false)
      }
    },
  })

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-6 py-8">
        {/* Header with Back Button */}
        <CustomHeader title='Add New Meal' />
       

        <View className="space-y-4">
          {/* Meal Title */}
          <CustomInput
            label="Meal Title"
            placeholder="Enter meal title"
            value={formik.values.title}
            onChangeText={formik.handleChange('title')}
            type="text"
            error={formik.touched.title && formik.errors.title ? formik.errors.title : undefined}
          />

          {/* Description */}
          <View className="mb-4">
            <Text
              className="text-gray-700 text-base font-medium mb-2"
              style={{ fontFamily: 'Cairo_600SemiBold' }}
            >
              Description
            </Text>
            <CustomInput
              placeholder="Enter meal description"
              value={formik.values.description}
              onChangeText={formik.handleChange('description')}
              type="text"
              error={formik.touched.description && formik.errors.description ? formik.errors.description : undefined}
            />
          </View>

          {/* Price */}
          <CustomInput
            label="Price ($)"
            placeholder="Enter meal price"
            value={formik.values.price}
            onChangeText={formik.handleChange('price')}
            type="text"
            keyboardType="numeric"
            error={formik.touched.price && formik.errors.price ? formik.errors.price : undefined}
          />

          <CustomImagePicker
            label="Meal Image"
            placeholder="Tap to select meal image"
            changeText="Tap to change meal image"
            value={formik.values.image}
            onImageSelect={(uri) => formik.setFieldValue('image', uri)}
            error={formik.touched.image && formik.errors.image ? formik.errors.image : undefined}
          />

          {/* Meal Image Picker */}
          {/* <View className="mb-4">
            <Text
              className="text-gray-700 text-base font-medium mb-2"
              style={{ fontFamily: 'Cairo_600SemiBold' }}
            >
              Meal Image
            </Text>

            <TouchableOpacity
              onPress={() => pickImage(formik.setFieldValue)}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 items-center justify-center min-h-[120px]"
            >
              {selectedImage ? (
                <View className="items-center">
                  <Image
                    source={{ uri: selectedImage }}
                    className="w-20 h-20 rounded-lg mb-2"
                    resizeMode="cover"
                  />
                  <Text
                    className="text-blue-600 text-sm"
                    style={{ fontFamily: 'Cairo_400Regular' }}
                  >
                    Tap to change image
                  </Text>
                </View>
              ) : (
                <View className="items-center">
                  <Ionicons name="camera" size={32} color="#9CA3AF" />
                  <Text
                    className="text-gray-500 mt-2 text-center"
                    style={{ fontFamily: 'Cairo_400Regular' }}
                  >
                    Tap to select meal image
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            {formik.touched.image && formik.errors.image && (
              <Text
                className="text-red-500 mt-1 text-sm"
                style={{ fontFamily: 'Cairo_400Regular' }}
              >
                {formik.errors.image}
              </Text>
            )}
          </View> */}

          {/* Submit Button */}
          <View className="mt-8">
            <CustomButton
              title={isSubmitting ? 'Adding Meal...' : 'Add Meal'}
              onPress={formik.handleSubmit}
              disabled={isSubmitting || !formik.isValid || !formik.dirty}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  )
}
