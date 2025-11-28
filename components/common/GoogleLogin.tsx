import React from 'react'
import { View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Text, Image, TouchableOpacity } from 'react-native'


export default function GoogleLogin() {
    const { t, i18n } = useTranslation()
    return (
        <View>

            {/* Divider */}
            <View className="flex-row items-center my-6">
                <View className="flex-1 h-px bg-gray-300" />
                <Text
                    className="mx-4 text-gray-500 text-sm"
                    style={{ fontFamily: 'Cairo_400Regular' }}
                >
                    {t('auth.orContinueWith')}
                </Text>
                <View className="flex-1 h-px bg-gray-300" />
            </View>

            {/* Google Login Button */}
            <TouchableOpacity
                onPress={() => {
                    // Handle Google login
                }}
                className="bg-black border-2 border-gray-300 py-4 rounded-xl flex-row justify-center items-center "

            >
                {/* <Ionicons name="logo-google" size={24} color="#DB4437" /> */}
                <Image source={require('../../assets/icons/google.png')} style={{ width: 24, height: 24 }} />
                <Text
                    className="ml-3 text-white text-base font-semibold"
                    style={{ fontFamily: 'Cairo_600SemiBold' }}
                >
                    {t('auth.continueWithGoogle')}
                </Text>
            </TouchableOpacity>


        </View>
    )
}
