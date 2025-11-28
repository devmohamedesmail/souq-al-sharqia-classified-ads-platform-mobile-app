import CustomHeader from '@/components/ui/header'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { View, Text, ScrollView } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import AdUserItem from '@/items/aduseritem';
import NoAds from '@/components/NoAds'

export default function Approved() {
  const { t } = useTranslation();
  const { ads } = useLocalSearchParams()
  const parsedAds = JSON.parse(ads as any)
  return (
    <View>
      <CustomHeader title={t('home.approvedads')} />

      <ScrollView>
        {parsedAds && parsedAds.length > 0 ? (
          <>
            {parsedAds.map((item: any) => (
              <AdUserItem key={item.id} item={item} />
            ))}
          </>

        ) : (
          <NoAds />
        )}

      </ScrollView>
    </View>
  )
}
