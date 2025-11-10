import React from 'react'
import { ScrollView, View, Text } from 'react-native'
import useFetch from '@/hooks/useFetch';
import { useLocalSearchParams } from 'expo-router';
import CustomHeader from '@/components/custom/customheader';
import { useTranslation } from 'react-i18next';
import HomeBtnItem from '@/items/homebtnitem';
import { useRouter } from 'expo-router';

export default function PlaceCategories() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { place } = useLocalSearchParams<{ place: string }>();
  const placeData = place ? JSON.parse(place) : null;
  const { data, loading, error } = useFetch(`/places/categories/${placeData?.id}`)
  return (
    <View className='bg-white flex-1'>
      <CustomHeader title={i18n.language == 'ar' ? placeData?.name_ar : placeData?.name_en} />

      <ScrollView>
        {loading ? (
          <Text className='text-center p-3'>{t('home.pleasewait')}</Text>
        ) : (
          <View className='p-3'>
            {data && data.length > 0 && (
              <View>
                {data && data.map((category: any) => (
                  <HomeBtnItem
                    key={category.id}
                    title={i18n.language === 'ar' ? category.title_ar : category.title_en}
                    image={category.image}
                    // count={category.subcategories.length || 0}

                    onPress={
                      () => router.push({
                        pathname: '/places/subcategories',
                        params: {
                          category: JSON.stringify(category)
                        }
                      })}

                  />
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>

    </View>
  )
}
