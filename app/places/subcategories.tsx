import CustomHeader from '@/components/custom/customheader'
import React from 'react'
import { View } from 'react-native'
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function Subcategories() {
    const { t, i18n } = useTranslation();
    const {category} = useLocalSearchParams<{category: string}>()
    const categoryData = category ? JSON.parse(category) : null;
  return (
    <View>
        <CustomHeader 
        title={categoryData ? (i18n.language === 'ar' ? categoryData.title_ar : categoryData.title_en) : ''} />
    </View>
  )
}
