import CustomHeader from '@/components/custom/customheader'
import Search from '@/components/Search';
import HomeBtnItem from '@/items/homebtnitem';
import React from 'react'
import { useTranslation } from 'react-i18next';
import { View, Text, ScrollView } from 'react-native'
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
export default function Subcategories() {
    const { t, i18n } = useTranslation();
    const router = useRouter();
    const { category } = useLocalSearchParams()
    const parsedcategory = JSON.parse(category as any);


    return (
        <View className='bg-white'>

            <CustomHeader
                title={i18n.language === 'ar' ? parsedcategory.title_ar : parsedcategory.title_en}
            />
            <Search />

            <ScrollView >
                <View className='pb-96'>
                    {parsedcategory && parsedcategory.subcategories.map((subcategory: any) => (
                        <HomeBtnItem
                            key={subcategory.id}
                            title={i18n.language === 'ar' ? subcategory.title_ar : subcategory.title_en}
                            image={subcategory.image}
                            count={subcategory.ads.length || 0}
                            onPress={() => {
                                router.push({
                                    pathname: '/ads/ads',
                                    params: {
                                        id: subcategory.id,
                                        title: i18n.language === 'ar' ? subcategory.title_ar : subcategory.title_en
                                    },
                                })
                            }}
                        />
                    ))}
                </View>

            </ScrollView>
        </View>
    )
}
