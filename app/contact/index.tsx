import CustomHeader from '@/components/custom/customheader'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { View, Text, TouchableOpacity, Linking, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import useFetch from '@/hooks/useFetch'
import CustomLoading from '@/components/custom/customloading'

export default function Contact() {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const { data, loading, error } = useFetch('/settings');
 

    const handlePhoneCall = () => {
        const phoneNumber = t('contact.phoneNumber');
        Linking.openURL(`tel:${data?.data?.phone}`).catch(() => {
            Alert.alert('Error', 'Unable to make phone call');
        });
    };

    const handleEmailPress = () => {
        const email = t('contact.emailAddress');
        Linking.openURL(`mailto:${data?.data?.email}`).catch(() => {
            Alert.alert('Error', 'Unable to open email client');
        });
    };

    return (
        <View className="flex-1 bg-gray-50">
            <CustomHeader title={t('contact.title')} />

            <View className="flex-1 p-5">
                {/* Description */}
                <View className="bg-white p-5 rounded-xl mb-8 shadow-sm border-l-4 border-blue-500">
                    <Text
                        className={`text-base leading-6 text-gray-600 font-medium ${isRTL ? 'text-right' : 'text-left'}`}
                        style={{ fontFamily: 'Cairo_400Regular' }}
                    >
                        {t('contact.description')}
                    </Text>
                </View>


            {loading ? (<>
            <CustomLoading />
            
            </>):(
                 <View className="gap-5">
                    {/* Phone Button */}
                    <TouchableOpacity
                        className="bg-white rounded-2xl shadow-lg overflow-hidden"
                        onPress={handlePhoneCall}
                        activeOpacity={0.8}
                    >
                        <View className="flex-row p-5 items-center">
                            <View className="w-15 h-15 rounded-full bg-green-600 justify-center items-center mr-4 p-3">
                                <Ionicons name="call" size={24} color="#fff" />
                            </View>
                            <View className={`flex-1 ${isRTL ? 'items-end' : 'items-start'}`}>
                                <Text
                                    className={`text-lg text-gray-800 mb-1  ${isRTL ? 'text-right arabic-font' : 'text-left'}`}

                                >
                                    {t('contact.phone')}
                                </Text>
                                <Text
                                    className={`text-base text-blue-600 font-semibold mb-1.5 ${isRTL ? 'text-right' : 'text-left'}`}
                                    style={{ fontFamily: 'Cairo_600SemiBold' }}
                                >
                                    {/* {t('contact.phoneNumber')} */}
                                    {data.data?.phone}
                                </Text>
                                <Text
                                    className={`text-sm text-gray-500 leading-5 ${isRTL ? 'text-right' : 'text-left'}`}
                                    style={{ fontFamily: 'Cairo_400Regular' }}
                                >
                                    {t('contact.phoneDescription')}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    {/* Email Button */}
                    <TouchableOpacity
                        className="bg-white rounded-2xl shadow-lg overflow-hidden"
                        onPress={handleEmailPress}
                        activeOpacity={0.8}
                    >
                        <View className="flex-row p-5 items-center">
                            <View className="w-15 h-15 rounded-full bg-red-600 justify-center items-center mr-4 p-3">
                                <Ionicons name="mail" size={24} color="#fff" />
                            </View>
                            <View className={`flex-1 ${isRTL ? 'items-end' : 'items-start'}`}>
                                <Text
                                    className={`text-lg text-gray-800 mb-1  ${isRTL ? 'text-right arabic-font' : 'text-left'}`}

                                >
                                    {t('contact.email')}
                                </Text>
                                <Text
                                    className={`text-base text-blue-600 font-semibold mb-1.5 ${isRTL ? 'text-right' : 'text-left'}`}
                                    style={{ fontFamily: 'Cairo_600SemiBold' }}
                                >
                                    {/* {t('contact.emailAddress')}  */}
                                    {data.data?.email}
                                </Text>
                                <Text
                                    className={`text-sm text-gray-500 leading-5 ${isRTL ? 'text-right' : 'text-left'}`}
                                    style={{ fontFamily: 'Cairo_400Regular' }}
                                >
                                    {t('contact.emailDescription')}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            )}

                {/* Contact Buttons */}
               
            </View>
        </View>
    )
}
