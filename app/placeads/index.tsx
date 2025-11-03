import React from 'react'
import { View, Text, ScrollView } from 'react-native';
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


    return (
        <View className='bg-white flex-1' >
            <CustomHeader title={i18n.language == 'ar' ? placeData?.name_ar : placeData?.name_en} />
            
            <ScrollView>
                <View className='mt-2 mb-20 p-3'>
                    {loading ? (<CustomLoading />) : (
                    <>

                        {data && data.length > 0
                            ? data.map((ad:any, index:number) => (
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
