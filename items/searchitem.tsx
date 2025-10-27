import React from 'react'
import { Image, TouchableOpacity, View, Text } from 'react-native'
import { useNavigation } from 'expo-router';
import { config } from '@/constants/config';
import { useTranslation } from 'react-i18next';


export default function SearchItem({ item }: any) {
  const navigation: any = useNavigation();
  const { t, i18n } = useTranslation()

  const imagesArray = typeof item.images === 'string' ? JSON.parse(item.images) : item.images;
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('ads/details', {
        ad: JSON.stringify(item)
      })}
      className='bg-white my-2'
    >
      <View className='flex-row p-4 border-b border-gray-200'>

        <View>
          {item.images && item.images.length > 0 ? (
            <Image source={{ uri: imagesArray[0] }} style={{ width: 100, height: 100 }} />
          ) : (
            <Image source={require('../assets/images/placeholder.png')} style={{ width: 100, height: 100 }} />
          )}

        </View>
        <View className='mx-4 flex-1 justify-center'>
          <Text className={` font-semibold arabic-font ${i18n.language === 'ar' ? 'text-right' : ''}`}>{item.title}</Text>
          {/* <Text>{item?.price ? `${item.price} ${config.CURRENCY_AR}` : ''}</Text> */}
        </View>
      </View>
    </TouchableOpacity>
  )
}
