import CustomHeader from '@/components/custom/customheader'
import { AuthContext } from '@/context/auth_context';
import AdUserItem from '@/items/aduseritem';
import { useLocalSearchParams } from 'expo-router';
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, View, Text } from 'react-native'
import NoAds from '@/components/NoAds';

export default function Rejected() {
    const { t , i18n} = useTranslation();
    const { auth } = useContext(AuthContext)
    const { ads } = useLocalSearchParams()
    const parsedAds = JSON.parse(ads as any)




    return (
        <View>
            <CustomHeader title={t('home.rejectedads')} />

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
