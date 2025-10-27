import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';

export default function NoAds() {
    const { t, i18n } = useTranslation();
    const router = useRouter();

    return (
        <View className="flex-1 justify-center items-center px-6">
            <View className="bg-gray-100 rounded-full p-8 mb-6">
                {/* <Ionicons name="documents-outline" size={80} color="#9CA3AF" /> */}
                <Image
                    source={require('../assets/images/noads.png')}
                    style={{ width: 100, height: 100 }}
                    resizeMode="contain"
                />
            </View>
            <Text
                className={`text-2xl  text-gray-800 mb-3 text-center ${i18n.language === 'ar' ? 'arabic-font-bold' : 'text-left'}`}

            >
                {t('ad.no_ads')}
            </Text>

            <TouchableOpacity
                onPress={() => router.push('/')}

                className=" bg-primary px-6 w-full py-3 rounded-full flex-row items-center justify-center mt-10">
                <Text className={`text-white ${i18n.language === 'ar' ? 'arabic-font-bold' : 'text-left'}`}>{t('home.title')}</Text>
            </TouchableOpacity>

        </View>
    )
}
