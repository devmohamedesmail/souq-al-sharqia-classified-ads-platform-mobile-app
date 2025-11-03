import React from 'react'
import { useTranslation } from 'react-i18next';
import { View, Text, Image, TouchableOpacity } from 'react-native'
import Swiper from 'react-native-swiper'
import { config } from '@/constants/config';
import { useNavigation } from 'expo-router';
import axios from 'axios';
import { Toast } from 'toastify-react-native';

export default function AdItem({ ad }: any) {
    const { t, i18n } = useTranslation();
    const navigation: any = useNavigation();





const ad_details = async(ad:any) => {
    try {
          navigation.navigate('ads/details', { ad: JSON.stringify(ad) });
          const response = await axios.get(`${config.URL}/ad/details/${ad.id}`);
    } catch (error) {
        Toast.show({
            type: 'error',
            text1: t("ad.fetch_error"),
            position: 'bottom',
        })
    }
  
}



    return (
        <TouchableOpacity
            // onPress={() => navigation.navigate('ads/details', { ad: JSON.stringify(ad) })}
            // onPress={() => navigation.navigate('ads/details', { ad_id : ad.id })}
            onPress={()=>ad_details(ad)}
            className='m-2 bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 mb-4'
        >
            {/* Image Swiper */}
            {ad.images && ad.images.length > 0 ? (
                <View style={{ height: 200 }}>
                    <Swiper
                        showsButtons={false}
                        dotStyle={{ backgroundColor: 'rgba(255,255,255,0.5)', width: 8, height: 8 }}
                        activeDotStyle={{ backgroundColor: '#fff', width: 8, height: 8 }}
                        paginationStyle={{ bottom: 10 }}
                        autoplay={false}
                    >
                        {ad.images.map((img: any, index: number) => (
                            <View key={index} style={{ flex: 1 }}>
                                <Image
                                    source={{ uri: img }}
                                    style={{ width: '100%', height: 200 }}
                                    resizeMode="cover"
                                />
                            </View>
                        ))}
                    </Swiper>
                </View>
            ) : (
                <View className='h-[200px] bg-gray-100 justify-center items-center'>
                    <Image
                        source={require('../assets/images/placeholder.png')}
                        style={{ width: '100%', height: 200 }}
                        resizeMode="cover"
                    />
                </View>
            )}


            {/* Content */}
            <View className='p-3'>
                <Text
                    className={`text-base font-bold text-gray-900 mb-1 ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}
                    style={{ fontFamily: 'Cairo_700Bold' }}
                    numberOfLines={2}
                >
                    {ad.title}
                </Text>

                {ad.price && (
                    <Text
                        className='text-lg font-bold text-green-600 mb-2'
                        style={{ fontFamily: 'Cairo_700Bold' }}
                    >
                        {ad.price} {i18n.language === 'ar' ? config.CURRENCY_AR : config.CURRENCY_EN}
                    </Text>
                )}

                {ad.description && (
                    <Text
                        className={`text-sm text-gray-600 ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}
                        style={{ fontFamily: 'Cairo_400Regular' }}
                        numberOfLines={2}
                    >
                        {ad.description}
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    )
}