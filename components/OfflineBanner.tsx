import React, { useEffect, useState } from 'react'
import { View, Text, Animated, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'

export default function OfflineBanner() {
    const { t, i18n } = useTranslation();
    return (
        <View

            className="px-4 py-10 flex items-center justify-center shadow-lg"
        >

            <View className='flex-row items-center justify-center'>
                <Ionicons name="cloud-offline" size={20} color="black" />
                <Text className={`font-semibold ml-2 text-black ${i18n.language === 'ar' ? 'arabic-font' : ''}`}>
                    {t('offlineBanner.noConnection')}
                </Text>
            </View>

            <View className='mt-10'>
                <Image
                    source={require('../assets/images/no-wifi.png')}
                    className="w-32 h-32 ml-2"
                />
            </View>
        </View>
    )
}
