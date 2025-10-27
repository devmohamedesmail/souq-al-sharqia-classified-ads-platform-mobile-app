import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Image, RefreshControl, Alert, StatusBar } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import axios from 'axios'
import { Toast } from 'toastify-react-native'
import MenuItem from '@/items/mealitem'
import CustomLoading from '@/components/custom/customloading'
import CustomHeader from '@/components/custom/customheader'

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

export default function Menu() {
  const { t } = useTranslation()
  const router = useRouter()
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get('https://uber-express-project.onrender.com/api/menu/restaurant/2')
      if (response.data.success) {
        setMenuItems(response.data.data)
      }
    } catch (error: any) {
      console.error('Error fetching menu items:', error)
      Toast.error(t('failed_to_load_menu_items'))
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleDeleteItem = async (itemId: number) => {
    Alert.alert(
      t('delete_menu_item'),
      t('delete_menu_item_confirmation'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.delete(`https://uber-express-project.onrender.com/api/menu/item/${itemId}`)
              Toast.success(t('menu_item_deleted_successfully'))
              fetchMenuItems() // Refresh the list
            } catch (error) {
              console.error('Error deleting item:', error)
              Toast.error(t('failed_to_delete_menu_item'))
            }
          }
        }
      ]
    )
  }

  const onRefresh = () => {
    setRefreshing(true)
    fetchMenuItems()
  }

  useEffect(() => {
    fetchMenuItems()
  }, [])



  if (loading) {
    return (

      <CustomLoading
        variant="pulse"
        overlay={true}
        text="Processing your order..."
      />
    )
  }

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <CustomHeader title={t('menu')} />
      {/* Header */}
      {/* <View className="bg-white px-6 py-4 shadow-sm">
        <View className="flex-row justify-between items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-2"
          >
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>

          <Text
            className="text-xl font-bold text-gray-800"
            style={{ fontFamily: 'Cairo_700Bold' }}
          >
            {t('restaurant_menu')}
          </Text>

          <TouchableOpacity
            onPress={() => router.push('/restaurant/meal')}
            className="bg-blue-600 px-4 py-2 rounded-lg"
          >
            <Ionicons name="add" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View> */}


      <View className='px-6 py-4 flex-row justify-end items-center'>
        <TouchableOpacity
          onPress={() => router.push('/restaurant/meal')}
          className="bg-primary flex justify-center items-center p-0 w-12 h-12 rounded-lg"
        >
          <Ionicons name="add" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Menu Items List */}
      <ScrollView
        className="flex-1 px-6 py-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {menuItems.length === 0 ? (
          <View className="flex-1 justify-center items-center py-20">
            <Ionicons name="restaurant" size={64} color="#9CA3AF" />
            <Text
              className="text-gray-500 text-lg mt-4 mb-2"
              style={{ fontFamily: 'Cairo_600SemiBold' }}
            >
              {t('no_menu_items_yet')}
            </Text>
            <Text
              className="text-gray-400 text-center mb-6"
              style={{ fontFamily: 'Cairo_400Regular' }}
            >
              {t('start_building_menu')}
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/restaurant/meal')}
              className="bg-blue-600 px-6 py-3 rounded-lg"
            >
              <Text
                className="text-white font-semibold"
                style={{ fontFamily: 'Cairo_600SemiBold' }}
              >
                {t('add_first_meal')}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View className="flex-row justify-between items-center mb-4">
              <Text
                className="text-lg font-semibold text-gray-800"
                style={{ fontFamily: 'Cairo_600SemiBold' }}
              >
                {t('menu_items')} ({menuItems.length})
              </Text>
            </View>

            {/* {menuItems.map(renderMenuItem)} */}
            {menuItems.map((item) => (
              <MenuItem key={item.id} item={item} fetchMenuItems={fetchMenuItems} />
            ))}


          </>
        )}
      </ScrollView>
    </View>
  )
}
