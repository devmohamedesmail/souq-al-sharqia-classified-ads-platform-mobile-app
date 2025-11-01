import React, { useContext, useEffect, useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import Feather from '@expo/vector-icons/Feather';
import { useTranslation } from 'react-i18next';
import HomeBtnItem from '@/items/homebtnitem';
import help from '../assets/images/help.png'
import postAd from '../assets/images/post.png'
import { useNavigation, useRouter } from 'expo-router';
import Search from '@/components/Search';
import Logo from '@/components/logo';
import CustomLoading from '@/components/custom/customloading';
import useFetch from '@/hooks/useFetch';
import rejected from "../assets/images/cross.png"
import approved from "../assets/images/approve.png"
import axios from 'axios';
import { config } from '@/constants/config';
import { useDeviceId } from '@/hooks/useDeviceId';
import { AuthContext } from '@/context/auth_context';
import { useNetwork } from '@/context/NetworkProvider';
import OfflineBanner from '@/components/OfflineBanner';

export default function Home() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { data, loading, error } = useFetch('/categories')
  const navigation: any = useNavigation()
  const [rejectedads, setRejectedads] = useState<any>(null);
  const [acceptedads, setAcceptedads] = useState<any>(null);
  const { deviceId, shortDeviceId, isLoading } = useDeviceId();
  const { auth } = useContext(AuthContext)
  const { isConnected } = useNetwork();

  const fetch_rejected_ads = async () => {
    try {
      const result = await axios.get(`${config.URL}/show/user/rejected/ads/${auth ? auth?.user?.id : shortDeviceId}`)
      setRejectedads(result.data)
    } catch (error) {
      console.log(error)
    }
  }
  const fetch_accepted_ads = async () => {
    try {
      const result = await axios.get(`${config.URL}/show/user/accepted/ads/${auth ? auth?.user?.id : shortDeviceId}`)
      setAcceptedads(result.data)
    } catch (error) {
      console.log(error)
    }
  }




  useEffect(() => {
    fetch_rejected_ads();
    fetch_accepted_ads()
  }, [])


  // Show loading while device ID is being loaded
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <CustomLoading />
      </View>
    );
  }






  return (
    <View className='  '>
      {/* header seaction */}
      <View className='bg-primary py-5 pt-14 px-3 flex flex-row items-center justify-between'>

        <TouchableOpacity className='ml-3' onPress={() => router.push("/account")}>
          <Feather name="settings" size={24} color="white" />
        </TouchableOpacity>


        <View className='flex flex-row items-center '>
          {/* <Text className='text-white  arabic-font text-xl'> {t("home.app")}</Text> */}
          <Logo width={100} height={50} />
        </View>
      </View>


      {isConnected ?

        <ScrollView className='pb-5 mb-44'>
          <View className='pb-10'>

            <Search />

            <HomeBtnItem
              title={t('home.postad')}
              onPress={() => router.push("/ads/post")}
              image={postAd} />


            {/* Categories */}
            <View className='bg-white my-1'>
              <Text className={` p-2 ${i18n.language === 'ar' ? 'text-right arabic-font' : ''} `}>{t('home.categories')}</Text>
              {loading ? (

                <CustomLoading title={t('home.categoriesLoading')} />
              ) : (
                <View>
                  {data && data.map((category: any) => (
                    <HomeBtnItem
                      key={category.id}
                      title={i18n.language === 'ar' ? category.title_ar : category.title_en}
                      image={category.image}
                      count={category.subcategories.length || 0}
                      onPress={() =>

                        navigation.navigate('categories/subcategories', {
                          category: JSON.stringify(category),

                        })
                      }

                    />
                  ))}
                </View>
              )}
            </View>



            {/* ads buttons control */}
            <View className='bg-white my-1'>
              <Text className={` p-2 ${i18n.language === 'ar' ? 'text-right arabic-font' : ''} `}>{t('home.ads')}</Text>
              <HomeBtnItem
                onPress={() => navigation.navigate('ads/rejected', {
                  ads: JSON.stringify(rejectedads)
                })}
                title={t('home.rejectedads')}
                image={rejected}
                count={rejectedads && rejectedads.length || 0}
              />


              <HomeBtnItem
                onPress={() => navigation.navigate('ads/approved', {
                  ads: JSON.stringify(acceptedads)
                })}
                title={t('home.approvedads')}
                image={approved}
                count={acceptedads && acceptedads.length || 0}
              />
            </View>




            {/* support */}
            <View className='bg-white my-2'>
              <Text className={` p-2 ${i18n.language === 'ar' ? 'text-right arabic-font' : ''} `}>{t('home.support')}</Text>
              <HomeBtnItem
                onPress={() => router.push("/contact")}
                title={t('home.support')}
                image={help} />
            </View>
          </View>
        </ScrollView>
        : <OfflineBanner />}




    </View>
  )
}
