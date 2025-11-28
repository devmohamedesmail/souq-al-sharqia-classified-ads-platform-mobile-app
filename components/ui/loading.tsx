import React from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { useTranslation } from 'react-i18next';
import Logo from '../common/logo';



export default function Loading({title = ''}: {title?: string}) {
  const { t, i18n } = useTranslation();
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <Logo width={100} height={50} />
      <Text className='text-primary arabic-font mt-2'>{title || t('home.loading')}</Text>
      <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 10 }} />

    </View>
  )
}
