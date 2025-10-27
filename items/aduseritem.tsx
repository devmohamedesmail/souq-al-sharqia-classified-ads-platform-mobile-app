import React from 'react'
import { Image, View, Text, TouchableOpacity, Alert } from 'react-native'
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from 'expo-router';
import Swiper from 'react-native-swiper'
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { config } from '@/constants/config';
import { Toast } from 'toastify-react-native';

export default function AdUserItem({ item }: any) {
    const navigation: any = useNavigation();
    const { t, i18n } = useTranslation();

    const handleDelete = () => {
        Alert.alert(
            t('ad.delete_ad'),
            t('ad.confirm_delete'),

            [
                { text: t('ad.cancel'), style: 'cancel' },
                {
                    text: t('ad.delete_ad'),
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const response = await axios.delete(`${config.URL}/ad/delete/${item.id}`);
                            if (response.status === 200) {
                                
                                Toast.show({
                                    type: 'success',
                                    text1: t('ad.deletesuccess'),
                                    position: 'top',
                                })

                            } else {
                                Toast.show({
                                    type: 'error',
                                    text1: t('ad.deletefailed'),
                                    position: 'top',
                                })
                            }
                        } catch (error) {
                            Toast.show({
                                type: 'error',
                                text1: t('ad.deletefailed'),
                                position: 'top',
                            })
                        }
                        const response = axios.get(`${config.URL}/ad/details/${item.id}`)
                    }
                }
            ]
        );
    };

    return (
        <View className='mx-3 my-2 bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200'>
            {/* Image Swiper */}
            {item.images && item.images.length > 0 ? (
                <View style={{ height: 250 }}>
                    <Swiper
                        showsButtons={false}
                        dotStyle={{ backgroundColor: 'rgba(255,255,255,0.5)' }}
                        activeDotStyle={{ backgroundColor: '#fff' }}
                        paginationStyle={{ bottom: 10 }}
                    >
                        {item.images.map((img: any, index: number) => (
                            <View key={index} style={{ flex: 1 }}>
                                <Image
                                    source={{ uri: img }}
                                    style={{ width: '100%', height: 250 }}
                                    resizeMode="cover"
                                />
                            </View>
                        ))}
                    </Swiper>
                </View>
            ) : (
                <View className='h-[250px] bg-gray-100 justify-center items-center'>
                    <Feather name="image" size={48} color="#9CA3AF" />
                </View>
            )}

            {/* Content */}
            <View className='p-4'>
                <Text className='' style={{ color: 'green' }}>{item.views} {t('ad.views')}</Text>
                <Text
                    className={`text-lg font-bold text-gray-900 mb-2 ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}
                    style={{ fontFamily: 'Cairo_700Bold' }}
                    numberOfLines={2}
                >
                    {item.title}
                </Text>

                {item.price && (
                    <Text
                        className='text-xl font-bold text-green-600 mb-2'
                        style={{ fontFamily: 'Cairo_700Bold' }}
                    >
                        {item.price} {i18n.language === 'ar' ? 'ريال' : 'SAR'}
                    </Text>
                )}

                {item.description && (
                    <Text
                        className={`text-gray-600 mb-3 ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}
                        style={{ fontFamily: 'Cairo_400Regular' }}
                        numberOfLines={3}
                    >
                        {item.description}
                    </Text>
                )}

                {/* Meta Info */}
                <View className='flex-row items-center mb-2'>
                    <Feather name="user" size={14} color="#6B7280" />
                    <Text
                        className='text-gray-600 text-sm ml-2'
                        style={{ fontFamily: 'Cairo_400Regular' }}
                    >
                        {item.name}
                    </Text>
                </View>

                {item.phone && (
                    <View className='flex-row items-center mb-2'>
                        <Feather name="phone" size={14} color="#6B7280" />
                        <Text
                            className='text-gray-600 text-sm ml-2'
                            style={{ fontFamily: 'Cairo_400Regular' }}
                        >
                            {item.phone}
                        </Text>
                    </View>
                )}
            </View>

            {/* Action Buttons */}
            <View className='flex flex-row justify-between px-3 gap-2 pb-5'>
                <TouchableOpacity
                    onPress={handleDelete}
                    style={{ backgroundColor: '#EF4444' }}
                    className=' flex-1 flex-row items-center justify-center mx-1 py-3 rounded-lg'
                >
                    <Feather name="trash-2" size={18} color="white" />
                    <Text
                        className='text-white ml-2 font-semibold'
                        style={{ fontFamily: 'Cairo_600SemiBold' }}
                    >
                        {i18n.language === 'ar' ? 'حذف' : 'Delete'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => navigation.navigate('ads/edit', {
                        ad: JSON.stringify(item)
                    })}
                    className='bg-blue-600 flex-1 mx-2 flex-row items-center justify-center py-3 rounded-lg'
                >
                    <AntDesign name="edit" size={18} color="white" />
                    <Text
                        className='text-white ml-2 font-semibold'
                        style={{ fontFamily: 'Cairo_600SemiBold' }}
                    >
                        {i18n.language === 'ar' ? 'تعديل' : 'Edit'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
