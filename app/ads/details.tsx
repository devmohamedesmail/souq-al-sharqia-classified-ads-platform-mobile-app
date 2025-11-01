import React from 'react'
import { View, Text, Image, TouchableOpacity, ScrollView, Linking, Alert } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import CustomHeader from '@/components/custom/customheader';
import { useTranslation } from 'react-i18next';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Feather from '@expo/vector-icons/Feather';
import Swiper from 'react-native-swiper'
import { config } from '@/constants/config';

export default function Details() {
    const { ad } = useLocalSearchParams();
    // const { ad_id } = useLocalSearchParams();
    const parsedAd = JSON.parse(ad as any);
    const parsedImages = typeof parsedAd.images === 'string' ? JSON.parse(parsedAd.images) : parsedAd.images;
    const { t, i18n } = useTranslation();

    const handleCall = () => {
        if (parsedAd.phone) {
            Linking.openURL(`tel:${parsedAd.phone}`);
        }
    };

    const handleEmail = () => {
        if (parsedAd.email) {
            Linking.openURL(`mailto:${parsedAd.email}`);
        }
    };



    const handleReport = (postId: string) => {
        try {
            Alert.alert(
                t("ad.report_title"),
                t("ad.report_message"),
                [
                    {
                        text: t("ad.cancel"),
                        style: "cancel"
                    },
                    {
                        text: t("ad.report"),
                        onPress: () => {
                            // Here you would typically send the report to your backend
                            Alert.alert(t("ad.report_success"));
                        },
                        style: "destructive"
                    }
                ]
            );
        } catch (error) {

        }
    }




   






















    return (
        <View style={{ flex: 1 }} className='bg-gray-50'>
            <CustomHeader title={parsedAd.title.split(" ").slice(0, 3).join(" ")} />

            <ScrollView>

               
                {/* Image Swiper */}
                <View style={{ height: 300 }}>
                    {Array.isArray(parsedImages) && parsedImages.length > 0 ? (
                        <Swiper
                            showsButtons={false}
                            autoplay
                            autoplayTimeout={4}
                            dotStyle={{ backgroundColor: 'rgba(255,255,255,0.5)', width: 8, height: 8 }}
                            activeDotStyle={{ backgroundColor: '#fff', width: 8, height: 8 }}
                            paginationStyle={{ bottom: 10 }}
                        >
                            {parsedImages.map((img: string, index: number) => (
                                <View key={index} style={{ flex: 1 }}>
                                    <Image
                                        source={{ uri: img }}
                                        style={{
                                            width: '100%',
                                            height: 300,
                                            resizeMode: 'cover',
                                        }}
                                    />
                                </View>
                            ))}
                        </Swiper>
                    ) : (
                        <View className='w-full h-[300px] bg-gray-200 justify-center items-center'>
                            <Feather name="image" size={64} color="#9CA3AF" />
                        </View>
                    )}
                </View>

                {/* Price Section */}
                {parsedAd.price && (
                    <View className='bg-white px-4 py-4 border-b border-gray-200'>
                        <Text
                            className='text-3xl font-bold text-green-600'
                            style={{ fontFamily: 'Cairo_700Bold' }}
                        >
                            {parsedAd.price} {i18n.language === 'ar' ? config.CURRENCY_AR : config.CURRENCY_EN}
                        </Text>
                    </View>
                )}

                {/* Title & Description Section */}
                <View className='bg-white px-4 py-4 mb-2'>
                    <Text
                        className={`text-xl font-bold text-gray-900 mb-3 ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}
                        style={{ fontFamily: 'Cairo_700Bold' }}
                    >
                        {parsedAd.title}
                    </Text>

                    {parsedAd.description && (
                        <View>
                            {/* <Text 
                                className={`text-base font-semibold text-gray-700 mb-2 ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}
                                style={{ fontFamily: 'Cairo_600SemiBold' }}
                            >
                                {t("ad.details")}
                            </Text> */}
                            <Text
                                className={`text-sm text-gray-600 leading-6 ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}
                                style={{ fontFamily: 'Cairo_400Regular' }}
                            >
                                {parsedAd.description}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Seller Info Section */}
                {parsedAd.name && (
                    <View className='bg-white px-4 py-4 mb-2'>
                        <Text
                            className={`text-base font-semibold text-gray-700 mb-3 ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}
                            style={{ fontFamily: 'Cairo_600SemiBold' }}
                        >
                            {t("ad.publisher_info")}
                        </Text>
                        <View className='flex-row items-center'>
                            <View className='bg-gray-100 p-3 rounded-full mr-3'>
                                <Feather name="user" size={24} color="#6B7280" />
                            </View>
                            <Text
                                className='text-base text-gray-900'
                                style={{ fontFamily: 'Cairo_400Regular' }}
                            >
                                {parsedAd.name}
                            </Text>
                        </View>
                    </View>
                )}

                {/* Contact Section */}
                <View className='bg-white px-4 py-4 mb-20'>
                    <Text
                        className={`text-base font-semibold text-gray-700 mb-3 ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}
                        style={{ fontFamily: 'Cairo_600SemiBold' }}
                    >
                        {t("ad.contact")}
                    </Text>

                    {parsedAd.phone && (
                        <TouchableOpacity
                            onPress={handleCall}
                            className='mb-3 bg-green-600 py-4 rounded-xl flex-row justify-center items-center shadow-sm'
                            activeOpacity={0.8}
                        >
                            <Feather name="phone" size={20} color="white" />
                            <Text
                                className='mx-3 text-white text-base font-semibold'
                                style={{ fontFamily: 'Cairo_600SemiBold' }}
                            >
                                {parsedAd.phone}
                            </Text>
                        </TouchableOpacity>
                    )}

                    {parsedAd.email && (
                        <TouchableOpacity
                            onPress={handleEmail}
                            className='bg-blue-600 py-4 rounded-xl flex-row justify-center items-center shadow-sm'
                            activeOpacity={0.8}
                        >
                            <FontAwesome name="envelope-o" size={18} color="white" />
                            <Text
                                className='mx-3 text-white text-base font-semibold'
                                style={{ fontFamily: 'Cairo_600SemiBold' }}
                            >
                                {parsedAd.email}
                            </Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        onPress={() => handleReport(parsedAd.id)}
                        className='mt-4 bg-red-100 border border-red-300 py-3 rounded-xl flex-row justify-center items-center'
                        activeOpacity={0.8}
                    >
                        <Text
                            className='text-red-600 text-sm font-medium'
                            style={{ fontFamily: 'Cairo_500Medium' }}
                        >
                            🚩 {t("ad.report_content") || "الإبلاغ عن هذا المحتوى"}
                        </Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </View>
    )
}
