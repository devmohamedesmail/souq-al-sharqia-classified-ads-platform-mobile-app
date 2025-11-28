import CustomHeader from '@/components/ui/header'
import CustomLoading from '@/components/ui/loading';
import NoAds from '@/components/NoAds';
import useFetch from '@/hooks/useFetch';
import AdItem from '@/items/aditem';
import { useLocalSearchParams } from 'expo-router'
import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { useTranslation } from 'react-i18next';

export default function Ads() {
  const { category_id, subcategory_id , place } = useLocalSearchParams<{ 
    category_id: string, 
    subcategory_id: string, 
    place: string 
  }>();

  const placeData = place ? JSON.parse(place) : null;
  const {data, loading, error} = useFetch(`/places/categories/ads/${placeData?.id}/${category_id}/${subcategory_id}`);
 
  const { t, i18n } = useTranslation();
  return (
    <View>
      <CustomHeader
        title={i18n.language === 'ar' ? placeData?.name_ar : placeData?.name_en}
      />
      <ScrollView>
        {loading ? (
          <CustomLoading />
        ) : (
          <View className='p-3'>
            {data && data.data.length > 0 ? (
              data.data.map((ad: any) => (
                <AdItem key={ad.id} ad={ad} />
              ))
            ) : (
              <NoAds />
            )}
          </View>
        )}  
      </ScrollView>
    </View>
  )
}
