import React from 'react'
import { View, Text, ImageBackground } from 'react-native'
import LanguageSwitcher from './common/LanguageSwitcher'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'

export default function AuthHeader() {
    const { t, i18n } = useTranslation()
    const isRTL = i18n.language === 'ar'
    
    return (
        <ImageBackground
            source={{
                uri: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
            }}
            className="pt-12 pb-6 px-6"
            resizeMode="cover"
        >
            {/* Overlay for better text readability */}
            <View className="absolute inset-0 bg-black/50" />
            
            {/* Content */}
            <View className="relative z-10">
                {/* Language Toggle */}
              

                <View className="items-center mb-6">
                    <View className="bg-white/20 backdrop-blur-lg rounded-full p-6 mb-4 border border-white/30">
                        <Ionicons name="car-sport" size={40} color="white" />
                    </View>
                    <Text className="text-3xl arabic-font  text-white mb-2 text-center">
                        {t('auth.joinOurPlatform')}
                    </Text>
                    <Text className="text-gray-200 arabic-font text-base text-center max-w-xs">
                        {t('auth.getStartedJourney')}
                    </Text>
                </View>
            </View>
        </ImageBackground>
    )
}
