import CustomHeader from '@/components/ui/header'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { View, ScrollView, Text } from 'react-native'

export default function Privacy() {
    const {t, i18n} = useTranslation();
    const isRTL = i18n.language === 'ar';
    const isArabic = i18n.language === 'ar';

    const sections = [
        {
            title: t('privacy.informationCollection'),
            content: t('privacy.informationCollectionContent')
        },
        {
            title: t('privacy.howWeUse'),
            content: t('privacy.howWeUseContent')
        },
        {
            title: t('privacy.dataSharing'),
            content: t('privacy.dataSharingContent')
        },
        {
            title: t('privacy.dataSecurity'),
            content: t('privacy.dataSecurityContent')
        },
        {
            title: t('privacy.yourRights'),
            content: t('privacy.yourRightsContent')
        },
        {
            title: t('privacy.updates'),
            content: t('privacy.updatesContent')
        },
        {
            title: t('privacy.contact'),
            content: t('privacy.contactContent')
        }
    ];

    return (
        <View className="flex-1 bg-gray-50">
            <CustomHeader title={t('privacy.title')} />
            <ScrollView 
                className="flex-1"
                contentContainerClassName="p-5 pb-10"
                showsVerticalScrollIndicator={false}
            >
                {/* Introduction */}
                <View className="bg-white p-5 rounded-xl mb-5 shadow-sm border-l-4 border-blue-500">
                    <Text 
                        className={`text-base leading-6 text-gray-600 font-medium ${isRTL ? 'text-right' : 'text-left'}`}
                        style={{ fontFamily: isArabic ? 'Cairo_400Regular' : undefined }}
                    >
                        {t('privacy.introduction')}
                    </Text>
                </View>

                {/* Policy Sections */}
                {sections.map((section, index) => (
                    <View key={index} className="bg-white p-5 rounded-xl mb-4 shadow-sm">
                        <Text 
                            className={`text-lg text-gray-800 mb-3 border-b border-gray-200 pb-2 ${isRTL ? 'text-right' : 'text-left'}`}
                            style={{ fontFamily: isArabic ? 'Cairo_700Bold' : undefined }}
                        >
                            {section.title}
                        </Text>
                        <Text 
                            className={`text-[15px] leading-[22px] text-gray-500 ${isRTL ? 'text-right' : 'text-left'}`}
                            style={{ fontFamily: isArabic ? 'Cairo_400Regular' : undefined }}
                        >
                            {section.content}
                        </Text>
                    </View>
                ))}

                {/* Last Updated */}
                <View className="bg-blue-50 p-4 rounded-lg mt-5 border border-blue-200">
                    <Text 
                        className={`text-sm text-blue-700 font-semibold italic ${isRTL ? 'text-right' : 'text-left'}`}
                        style={{ fontFamily: isArabic ? 'Cairo_600SemiBold' : undefined }}
                    >
                        {t('privacy.lastUpdated')}
                    </Text>
                </View>
            </ScrollView>
        </View>
    )
}
