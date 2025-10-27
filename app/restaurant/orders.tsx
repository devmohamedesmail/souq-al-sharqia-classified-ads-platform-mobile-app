import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Alert, StatusBar } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import axios from 'axios'
import { Toast } from 'toastify-react-native'
import CustomLoading from '@/components/custom/customloading'
import CustomHeader from '@/components/custom/customheader'

interface OrderItem {
  id: number
  meal_name: string
  quantity: number
  price: string
}

interface Order {
  id: number
  customer_name: string
  customer_phone: string
  total_amount: string
  status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'completed' | 'cancelled'
  delivery_address: string
  order_date: string
  items: OrderItem[]
}

export default function Orders() {
  const { t } = useTranslation()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'active' | 'completed'>('all')

  // Mock data for demonstration - replace with actual API call
  const mockOrders: Order[] = [
    {
      id: 1,
      customer_name: "Ahmed Ali",
      customer_phone: "+971501234567",
      total_amount: "85.50",
      status: "pending",
      delivery_address: "Downtown Dubai, Business Bay",
      order_date: "2024-01-15T10:30:00Z",
      items: [
        { id: 1, meal_name: "Chicken Shawarma", quantity: 2, price: "25.00" },
        { id: 2, meal_name: "Falafel Plate", quantity: 1, price: "18.50" },
        { id: 3, meal_name: "Hummus", quantity: 2, price: "12.00" }
      ]
    },
    {
      id: 2,
      customer_name: "Sarah Johnson",
      customer_phone: "+971507654321",
      total_amount: "42.00",
      status: "preparing",
      delivery_address: "Marina Walk, Dubai Marina",
      order_date: "2024-01-15T11:15:00Z",
      items: [
        { id: 4, meal_name: "Grilled Salmon", quantity: 1, price: "42.00" }
      ]
    },
    {
      id: 3,
      customer_name: "Mohammed Hassan",
      customer_phone: "+971509876543",
      total_amount: "67.25",
      status: "ready",
      delivery_address: "Al Barsha, Mall of Emirates",
      order_date: "2024-01-15T09:45:00Z",
      items: [
        { id: 5, meal_name: "Mixed Grill", quantity: 1, price: "55.00" },
        { id: 6, meal_name: "Arabic Coffee", quantity: 2, price: "6.25" }
      ]
    }
  ]

  const fetchOrders = async () => {
    try {
      // Simulate API call
      setTimeout(() => {
        setOrders(mockOrders)
        setLoading(false)
        setRefreshing(false)
      }, 1000)
    } catch (error: any) {
      console.error('Error fetching orders:', error)
      Toast.error(t('failed_to_load_orders'))
      setLoading(false)
      setRefreshing(false)
    }
  }

  const updateOrderStatus = async (orderId: number, newStatus: Order['status']) => {
    try {
      // Simulate API call
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      )
      Toast.success(t('order_status_updated'))
    } catch (error) {
      console.error('Error updating order status:', error)
      Toast.error(t('failed_to_update_status'))
    }
  }

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'accepted': return 'bg-blue-100 text-blue-800'
      case 'preparing': return 'bg-orange-100 text-orange-800'
      case 'ready': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'time-outline'
      case 'accepted': return 'checkmark-circle-outline'
      case 'preparing': return 'restaurant-outline'
      case 'ready': return 'bag-check-outline'
      case 'completed': return 'checkmark-done-outline'
      case 'cancelled': return 'close-circle-outline'
      default: return 'help-outline'
    }
  }

  const filteredOrders = orders.filter(order => {
    switch (activeTab) {
      case 'pending': return order.status === 'pending'
      case 'active': return ['accepted', 'preparing', 'ready'].includes(order.status)
      case 'completed': return ['completed', 'cancelled'].includes(order.status)
      default: return true
    }
  })

  const onRefresh = () => {
    setRefreshing(true)
    fetchOrders()
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  if (loading) {
    return (
      <CustomLoading 
          variant="spinner" 
          size="large" 
          text={t('loading_orders')} 
        />
    )
  }

  const renderOrderCard = (order: Order) => (
    <View key={order.id} className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100">
      {/* Order Header */}
     
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <Text
            className="text-lg font-bold text-gray-800 mb-1"
            style={{ fontFamily: 'Cairo_700Bold' }}
          >
            {t('order')} #{order.id}
          </Text>
          <View className="flex-row items-center">
            <Ionicons name="person-outline" size={16} color="#6B7280" />
            <Text
              className="text-gray-600 ml-1"
              style={{ fontFamily: 'Cairo_400Regular' }}
            >
              {order.customer_name}
            </Text>
          </View>
        </View>
        
        <View className="items-end">
          <View className={`px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
            <View className="flex-row items-center">
              <Ionicons name={getStatusIcon(order.status)} size={14} color="currentColor" />
              <Text
                className="ml-1 font-medium text-xs"
                style={{ fontFamily: 'Cairo_600SemiBold' }}
              >
                {t(order.status)}
              </Text>
            </View>
          </View>
          
          <Text
            className="text-xl font-bold text-gray-800 mt-2"
            style={{ fontFamily: 'Cairo_700Bold' }}
          >
            ${order.total_amount}
          </Text>
        </View>
      </View>

      {/* Order Details */}
      <View className="border-t border-gray-100 pt-3 mb-3">
        <View className="flex-row items-center mb-2">
          <Ionicons name="call-outline" size={16} color="#6B7280" />
          <Text
            className="text-gray-600 ml-2"
            style={{ fontFamily: 'Cairo_400Regular' }}
          >
            {order.customer_phone}
          </Text>
        </View>
        
        <View className="flex-row items-start mb-2">
          <Ionicons name="location-outline" size={16} color="#6B7280" className="mt-1" />
          <Text
            className="text-gray-600 ml-2 flex-1"
            style={{ fontFamily: 'Cairo_400Regular' }}
          >
            {order.delivery_address}
          </Text>
        </View>
        
        <View className="flex-row items-center">
          <Ionicons name="time-outline" size={16} color="#6B7280" />
          <Text
            className="text-gray-600 ml-2"
            style={{ fontFamily: 'Cairo_400Regular' }}
          >
            {new Date(order.order_date).toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Order Items */}
      <View className="border-t border-gray-100 pt-3 mb-3">
        <Text
          className="text-sm font-semibold text-gray-700 mb-2"
          style={{ fontFamily: 'Cairo_600SemiBold' }}
        >
          {t('order_items')}:
        </Text>
        {order.items.map((item) => (
          <View key={item.id} className="flex-row justify-between items-center py-1">
            <Text
              className="text-gray-600 flex-1"
              style={{ fontFamily: 'Cairo_400Regular' }}
            >
              {item.quantity}x {item.meal_name}
            </Text>
            <Text
              className="text-gray-800 font-medium"
              style={{ fontFamily: 'Cairo_600SemiBold' }}
            >
              ${item.price}
            </Text>
          </View>
        ))}
      </View>

      {/* Action Buttons */}
      {order.status === 'pending' && (
        <View className="flex-row space-x-2">
          <TouchableOpacity
            onPress={() => updateOrderStatus(order.id, 'cancelled')}
            className="flex-1 bg-red-50 border border-red-200 py-3 rounded-lg"
          >
            <Text
              className="text-red-600 text-center font-semibold"
              style={{ fontFamily: 'Cairo_600SemiBold' }}
            >
              {t('reject')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => updateOrderStatus(order.id, 'accepted')}
            className="flex-1 bg-green-600 py-3 rounded-lg"
          >
            <Text
              className="text-white text-center font-semibold"
              style={{ fontFamily: 'Cairo_600SemiBold' }}
            >
              {t('accept')}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {order.status === 'accepted' && (
        <TouchableOpacity
          onPress={() => updateOrderStatus(order.id, 'preparing')}
          className="bg-orange-600 py-3 rounded-lg"
        >
          <Text
            className="text-white text-center font-semibold"
            style={{ fontFamily: 'Cairo_600SemiBold' }}
          >
            {t('start_preparing')}
          </Text>
        </TouchableOpacity>
      )}

      {order.status === 'preparing' && (
        <TouchableOpacity
          onPress={() => updateOrderStatus(order.id, 'ready')}
          className="bg-blue-600 py-3 rounded-lg"
        >
          <Text
            className="text-white text-center font-semibold"
            style={{ fontFamily: 'Cairo_600SemiBold' }}
          >
            {t('mark_ready')}
          </Text>
        </TouchableOpacity>
      )}

      {order.status === 'ready' && (
        <TouchableOpacity
          onPress={() => updateOrderStatus(order.id, 'completed')}
          className="bg-green-600 py-3 rounded-lg"
        >
          <Text
            className="text-white text-center font-semibold"
            style={{ fontFamily: 'Cairo_600SemiBold' }}
          >
            {t('mark_completed')}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  )

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <CustomHeader title={t('orders')} />
      {/* Header */}
     

      {/* Tabs */}
      <View className="bg-white px-6 py-3 border-b border-gray-100">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row space-x-4">
            {(['all', 'pending', 'active', 'completed'] as const).map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full ${
                  activeTab === tab ? 'bg-blue-600' : 'bg-gray-100'
                }`}
              >
                <Text
                  className={`font-medium ${
                    activeTab === tab ? 'text-white' : 'text-gray-600'
                  }`}
                  style={{ fontFamily: 'Cairo_600SemiBold' }}
                >
                  {t(tab)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Orders List */}
      <ScrollView
        className="flex-1 px-6 py-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredOrders.length === 0 ? (
          <View className="flex-1 justify-center items-center py-20">
            <Ionicons name="receipt-outline" size={64} color="#9CA3AF" />
            <Text
              className="text-gray-500 text-lg mt-4 mb-2"
              style={{ fontFamily: 'Cairo_600SemiBold' }}
            >
              {t('no_orders_found')}
            </Text>
            <Text
              className="text-gray-400 text-center"
              style={{ fontFamily: 'Cairo_400Regular' }}
            >
              {t('orders_will_appear_here')}
            </Text>
          </View>
        ) : (
          <>
            <View className="flex-row justify-between items-center mb-4">
              <Text
                className="text-lg font-semibold text-gray-800"
                style={{ fontFamily: 'Cairo_600SemiBold' }}
              >
                {t('total_orders')}: {filteredOrders.length}
              </Text>
            </View>
            
            {filteredOrders.map(renderOrderCard)}
          </>
        )}
      </ScrollView>
    </View>
  )
}
