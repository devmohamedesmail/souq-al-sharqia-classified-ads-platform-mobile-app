import CustomHeader from '@/components/ui/header'
import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useTranslation } from 'react-i18next';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function Support() {
    const { t, i18n } = useTranslation();
    return (
        <View>
            <CustomHeader title={t('home.support')} />

            <View className='mt-10 flex flex-row justify-around'>



                <TouchableOpacity className='flex-row items-center bg-primary flex-1 justify-between  py-10 border-b border-gray-400 mx-2'>
                    <View className='flex-row items-center justify-center w-full'>
                        <Feather name="phone" size={24} color="white" />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity className='flex-row items-center bg-primary flex-1 justify-between  py-10 border-b border-gray-400 mx-2'>
                    <View className='flex-row items-center justify-center w-full'>
                          <FontAwesome name="envelope-o" size={24} color="white" />
                    </View>
                </TouchableOpacity>



               
            </View>


























        </View>
    )
}
