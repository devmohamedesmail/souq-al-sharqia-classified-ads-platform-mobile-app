import AdItem from '@/items/aditem'
import React, { useState, useEffect } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { useLocalSearchParams, useNavigation } from 'expo-router';
import CustomHeader from '@/components/ui/header';
import axios from 'axios';
import { config } from '@/constants/config';
import CustomLoading from '@/components/ui/loading';
import { useTranslation } from 'react-i18next';
import NoAds from '@/components/NoAds';

export default function Ads() {
    const { id, title } = useLocalSearchParams();
    const [ads, setAds] = useState([])
    const [loading, setLoading] = useState(false);
    const [visibleAds, setVisibleAds] = useState(0);
    const { t } = useTranslation();
    const navigation:any = useNavigation();


    const fetch_ads = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${config.URL}/subcategories/ads/${id}`)
            const data = response.data;
            setAds(data);
            setLoading(false);

        } catch (error) {
            console.log(error);
            setLoading(false);

        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetch_ads()
    }, [id])

    return (
        <View className='flex-1 '>
            <CustomHeader title={`${title}`} />

            <ScrollView
                onScroll={(event) => {
                    const offsetY = event.nativeEvent.contentOffset.y;
                    const contentHeight = event.nativeEvent.contentSize.height;
                    const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
                    
                    // Calculate approximate number of visible ads based on scroll position
                    const adHeight = 280; // approximate height of each ad card
                    const scrolledAds = Math.floor(offsetY / adHeight) + Math.ceil(scrollViewHeight / adHeight);
                    const visible = Math.min(scrolledAds, ads.length);
                    setVisibleAds(visible);
                }}
                scrollEventThrottle={16}
            >
                {loading ? (<CustomLoading />) : (ads.length === 0 ? <NoAds /> : ads.map((ad: any) => (
                    // <AdItem
                    //     key={ad.id}
                    //     title={ad.title}
                    //     description={ad.description} price={ad.price}
                    //     images={ad.images}
                    //     onPress={() => navigation.navigate('ads/details', { ad: JSON.stringify(ad) })}
                    // />
                     <AdItem
                        key={ad.id}
                        ad={ad}
                    />
                )))}
            </ScrollView>


            <View className='flex flex-row justify-center items-center absolute bottom-20 left-0 right-0'>
                <View className='bg-primary px-10 py-3 rounded-full shadow-lg'>
                    <Text className='text-white text-center font-semibold' style={{ fontFamily: 'Cairo_600SemiBold' }}>
                        {visibleAds > 0 ? visibleAds : ads.length} {t('ad.from')} {ads.length}
                    </Text>
                </View>
            </View>



        </View>
    )
}
