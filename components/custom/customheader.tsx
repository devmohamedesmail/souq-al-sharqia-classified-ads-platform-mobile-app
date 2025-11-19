import React from 'react'
import { View, Text, TouchableOpacity, StatusBar } from 'react-native'
import { useTranslation } from 'react-i18next'

import { useRouter } from 'expo-router'
import Feather from '@expo/vector-icons/Feather';

export default function CustomHeader({ title }: { title?: string }) {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <View className='bg-primary h-fit pt-24  pb-5 flex flex-row justify-between items-center px-5'>
      <View></View>
      <View className='flex flex-row items-center '>
        <Text className='text-white mx-4 arabic-font text-lg'>{title}</Text>
        <TouchableOpacity onPress={() => router.back()}>

          <Feather name="arrow-right" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  )
}
