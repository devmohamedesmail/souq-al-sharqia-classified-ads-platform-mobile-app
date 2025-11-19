import CustomHeader from '@/components/custom/customheader'
import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import useFetch from '@/hooks/useFetch';
import CustomLoading from '@/components/custom/customloading';
import HomeBtnItem from '@/items/homebtnitem';
import { useRouter } from 'expo-router';

export default function Subcategories() {
  const { t, i18n } = useTranslation();
  const { category } = useLocalSearchParams<{ category: string }>()
  const { place } = useLocalSearchParams<{ place: string }>()
  const categoryData = category ? JSON.parse(category) : null;
  const placeData = place ? JSON.parse(place) : null;
  const router = useRouter();
  const { data: subcategories, loading: subcategoriesLoading, error: subcategoriesError } = useFetch(`/subcategories/${categoryData ? categoryData.id : ''}`)
  
  return (
    <View>
      <CustomHeader
        title={categoryData ? (i18n.language === 'ar' ? categoryData.title_ar : categoryData.title_en) : ''} />

      <ScrollView>
        {subcategoriesLoading ? (<CustomLoading />) : (
          <>
            {subcategories && subcategories.length > 0 ? (
              subcategories.map((subcategory: any) => (
                <HomeBtnItem
                  key={subcategory.id}
                  title={i18n.language === 'ar' ? subcategory.title_ar : subcategory.title_en}
                  image={subcategory.image}
                  count={subcategory.ads.length || 0}
                  onPress={() => {
                    router.push({
                      pathname: '/places/ads',
                      params: {
                        place: placeData ? JSON.stringify(placeData) : '',
                        category_id: categoryData ? categoryData.id : '',
                        subcategory_id: subcategory.id,
                        title: i18n.language === 'ar' ? subcategory.title_ar : subcategory.title_en
                      },
                    })
                  }}
                />
              ))
            ) : (
              <View style={{ padding: 10 }}>
                <Text style={{ fontSize: 18 }}>{t('no_subcategories')}</Text>
              </View>
              
            )}
          </>
        )}
      </ScrollView>



    </View>
  )
}
