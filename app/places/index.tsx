import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import CustomHeader from '@/components/custom/customheader';
import { useTranslation } from 'react-i18next';
import useFetch from '@/hooks/useFetch';
import CustomLoading from '@/components/custom/customloading';
import NoAds from '@/components/NoAds';
import AdItem from '@/items/aditem';

export default function PlaceAds() {
    const { place } = useLocalSearchParams<{ place: string }>();
    const placeData = place ? JSON.parse(place) : null;
    const { t, i18n } = useTranslation();
    const { data, loading, error } = useFetch(`/places/ads/${placeData?.id}`);
    const {data: categories,loading:loading_categories,error:error_categories} = useFetch(`/categories`);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

    // Filter ads based on selected category
    const filteredAds = useMemo(() => {
        if (!data || !Array.isArray(data)) return [];
        if (selectedCategoryId === null) return data;
        return data.filter((ad: any) => ad.category_id === selectedCategoryId);
    }, [data, selectedCategoryId]);

    return (
        <View className='bg-white flex-1' >
            <CustomHeader title={i18n.language == 'ar' ? placeData?.name_ar : placeData?.name_en} />


            <ScrollView horizontal className='px-3 pt-3 pb-3' showsHorizontalScrollIndicator={false}>
                <TouchableOpacity 
                    key="all"
                    onPress={() => setSelectedCategoryId(null)}
                    activeOpacity={0.7}
                    style={{ height: 36 }}
                >
                    <View className={`px-4 py-2 mr-2 rounded-full h-9 justify-center ${selectedCategoryId === null ? 'bg-secondary' : 'bg-gray-200'}`}>
                        <Text 
                            className={`text-sm ${selectedCategoryId === null ? 'text-black' : 'text-gray-700'}`}
                            style={{ fontFamily: 'Cairo_600SemiBold' }}
                            numberOfLines={1}
                        >
                            {t('ad.all')}
                        </Text>
                    </View>
                </TouchableOpacity>
                {categories && categories.length > 0  && categories.map((category:any)=>(
                    <TouchableOpacity 
                        key={category.id}
                        onPress={() => setSelectedCategoryId(category.id)}
                        activeOpacity={0.7}
                        style={{ height: 36 }}
                    >
                        <View className={`px-4 py-2 mr-2 rounded-full h-9 justify-center ${selectedCategoryId === category.id ? 'bg-secondary' : 'bg-gray-200'}`}>
                            <Text 
                                className={`text-sm ${selectedCategoryId === category.id ? 'text-black' : 'text-gray-700'}`}
                                style={{ fontFamily: 'Cairo_600SemiBold' }}
                                numberOfLines={1}
                            >
                                {i18n.language === "ar" ? category.title_ar : category.title_en}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )) }
            </ScrollView>
            
            <ScrollView>
                <View className='mt-2 mb-20 p-3'>
                    {loading ? (<CustomLoading />) : (
                    <>

                        {filteredAds && filteredAds.length > 0
                            ? filteredAds.map((ad:any, index:number) => (
                                //   <YourComponent key={index} item={item} />
                                <AdItem key={index} ad={ad} />
                            ))
                            : <NoAds />
                        }

                    </>)}
                </View>

            </ScrollView>
        </View>
    )
}
