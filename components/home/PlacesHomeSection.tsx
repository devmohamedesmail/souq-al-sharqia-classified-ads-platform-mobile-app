import React from 'react'
import { Text, View } from 'react-native'
import useFetch from '@/hooks/useFetch';
import { useTranslation } from 'react-i18next';
import HomeBtnItem from '@/items/homebtnitem';
import location from '../../assets/icons/location.png'
import { useRouter } from 'expo-router';
import Skeleton from '../ui/skeleton';

export default function PlacesHomeSection() {
    const { data, loading, error } = useFetch('/places')
    const { t, i18n } = useTranslation();
    const router = useRouter();

    return (
        <View className='bg-white my-1'>
            <Text className={` p-2 ${i18n.language === 'ar' ? 'text-right arabic-font' : ''} `}>{t('home.places')}</Text>

            {loading ? (
                <View className='gap-3 px-3'>
                    <Skeleton width={"100%"} height={70} />
                    <Skeleton width={"100%"} height={70} />
                    <Skeleton width={"100%"} height={70} />
                    <Skeleton width={"100%"} height={70} />
                    <Skeleton width={"100%"} height={70} />
                    <Skeleton width={"100%"} height={70} />
                </View>
            ) : (
                <>
                    {data && data.map((place: any) => (
                        <HomeBtnItem
                            key={place.id}
                            title={i18n.language === 'ar' ? place.name_ar : place.name_en}
                            image={location}
                            onPress={() =>
                                router.push({
                                    pathname: '/places/categories',
                                    params: {
                                        place: JSON.stringify(place)
                                    }
                                })
                            }
                        />
                    ))}
                </>
            )}
        </View>
    )
}
