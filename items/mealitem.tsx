import React from 'react'
import { View, Text , Image,TouchableOpacity } from 'react-native'


interface MenuItem {
  id: number
  restaurant_id: number
  title: string
  description: string
  price: string
  image: string
  createdAt: string
  updatedAt: string
}
import { Ionicons } from '@expo/vector-icons'
import { Alert } from 'react-native'
import axios from 'axios'
import { Toast } from 'toastify-react-native'
export default function MealItem({item,fetchMenuItems}:any) {





const handleDeleteItem = async (itemId: number) => {
    try {
        const response = await axios.delete(`https://uber-express-project.onrender.com/api/menu/item/${itemId}`)
       
        // You might want to refresh the list or update state here
        fetchMenuItems()
         Toast.show({
        text1: 'Menu item deleted successfully',
        type: 'success',
         })
    } catch (error) {
        console.error('Error deleting item:', error)
        Toast.error('Failed to delete menu item')
    }
}



  return (
    <View key={item.id} className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <View className="flex-row">
        {/* Image */}
        <View className="w-20 h-20 rounded-lg overflow-hidden mr-4">
          {item.image && item.image.startsWith('http') ? (
            <Image
              source={{ uri: item.image }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full bg-gray-200 items-center justify-center">
              <Ionicons name="image-outline" size={24} color="#9CA3AF" />
            </View>
          )}
        </View>

        {/* Content */}
        <View className="flex-1">
          <Text
            className="text-lg font-semibold text-gray-800 mb-1"
            style={{ fontFamily: 'Cairo_600SemiBold' }}
          >
            {item.title}
          </Text>
          
          <Text
            className="text-gray-600 text-sm mb-2"
            style={{ fontFamily: 'Cairo_400Regular' }}
            numberOfLines={2}
          >
            {item.description}
          </Text>
          
          <View className="flex-row justify-between items-center">
            <Text
              className="text-lg font-bold text-green-600"
              style={{ fontFamily: 'Cairo_700Bold' }}
            >
              ${parseFloat(item.price).toFixed(2)}
            </Text>
            
            <View className="flex-row">
              <TouchableOpacity
                onPress={() => {
                  // For now, just show edit functionality - you can create edit-meal.tsx later
                  Alert.alert('Edit Item', `Edit ${item.title}`)
                }}
                className="bg-blue-50 p-2 rounded-lg mr-2"
              >
                <Ionicons name="pencil" size={16} color="#3B82F6" />
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => handleDeleteItem(item.id)}
                className="bg-red-50 p-2 rounded-lg"
              >
                <Ionicons name="trash" size={16} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}
