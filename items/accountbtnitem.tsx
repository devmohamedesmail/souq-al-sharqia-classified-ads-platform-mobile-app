import React from 'react'
import { TouchableOpacity, View, Text } from 'react-native'
import EvilIcons from '@expo/vector-icons/EvilIcons';

export default function AccountBtnItem({ onPress, icon, title }: any) {
  return (
    <TouchableOpacity

      onPress={onPress}
      className="bg-white px-4 py-4 flex-row items-center justify-between border-b border-gray-100"
      activeOpacity={0.7}
    >
      <View className="flex-row items-center flex-1">
         <View
          className="w-10 h-10 rounded-full items-center justify-center mr-3"
        >
          {/* <EvilIcons name="chevron-right" size={24} color="black" /> */}
          <EvilIcons name="chevron-left" size={24} color="black" />
        </View>


         <View className="flex-1">
          <Text
            className="font-semibold text-right arabic-font-semibold">
            {title}
          </Text>

        </View>
       
      </View>
    </TouchableOpacity>
  )
}
