import React, { useContext, useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View, RefreshControl ,Share , Alert} from 'react-native'
import Feather from '@expo/vector-icons/Feather';
import { useTranslation } from 'react-i18next';
import HomeBtnItem from '@/items/homebtnitem';
import help from '../assets/images/help.png'
import postAd from '../assets/images/post.png'
import { useRouter } from 'expo-router';
import Search from '@/components/Search';
import Logo from '@/components/logo';
import CustomLoading from '@/components/custom/customloading';
import useFetch from '@/hooks/useFetch';
import rejected from "../assets/images/cross.png"
import approved from "../assets/images/approve.png"
import { useDeviceId } from '@/hooks/useDeviceId';
import { AuthContext } from '@/context/auth_context';
import { useNetwork } from '@/context/NetworkProvider';
import OfflineBanner from '@/components/OfflineBanner';
import PlacesHomeSection from '@/components/PlacesHomeSection';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';


export default function Home() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { deviceId, shortDeviceId, isLoading } = useDeviceId();
  const { auth } = useContext(AuthContext)
  const { isConnected } = useNetwork();
  const [refreshing, setRefreshing] = useState(false);
  const { data: categories, 
          loading: categoriesLoading, 
          error: categoriesError,
          refetch: refetchCategories } = useFetch('/categories')

  const { data: rejected_ads, 
          loading: rejected_ads_loading, 
          error: rejected_ads_error ,
          refetch: refetchRejected } = useFetch(`/show/user/rejected/ads/${auth ? auth?.user?.id : shortDeviceId}`)
  const { data: accepted_ads, 
          loading: accepted_ads_loading, 
          error: accepted_ads_error ,
          refetch: refetchAccepted } = useFetch(`/show/user/accepted/ads/${auth ? auth?.user?.id : shortDeviceId}`)

  const { data: pending_ads, 
          loading: pending_ads_loading, 
          error: pending_ads_error ,
          refetch: refetchPending } = useFetch(`/show/user/pending/ads/${auth ? auth?.user?.id : shortDeviceId}`)



  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // Refetch all data
      await Promise.all([
        refetchCategories?.(),
        refetchRejected?.(),
        refetchAccepted?.(),
        refetchPending?.()
      ]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };



  // Show loading while device ID is being loaded
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <CustomLoading />
      </View>
    );
  }



  return (
    <SafeAreaView className=' ' edges={['bottom']}>
      {/* header seaction */}
      <View className='bg-primary py-5 pt-20 px-3 flex flex-row items-center justify-between'>

        <TouchableOpacity className='ml-3' onPress={() => router.push("/account")}>
          {/* <Feather name="settings" size={24} color="white" /> */}
          <FontAwesome name="user" size={24} color="white" />
        </TouchableOpacity>

        

        <View className='flex flex-row items-center '>
          {/* <Text className='text-white  arabic-font text-xl'> {t("home.app")}</Text> */}
          <Logo width={100} height={50} />
        </View>
      </View>


      {isConnected ?

        <ScrollView className='pb-44 '
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#2563eb']} // Android
              tintColor='#2563eb' // iOS
            />
          }
        >
          <View className='pb-44'>

            <Search />

            <HomeBtnItem
              title={t('home.postad')}
              onPress={() => router.push(`${auth ? '/ads/post' : '/auth/login'}`)}
              image={postAd} />



            <PlacesHomeSection />


            {/* Categories */}
            <View className='bg-white my-1'>
              <Text className={` p-2 ${i18n.language === 'ar' ? 'text-right arabic-font' : ''} `}>{t('home.categories')}</Text>
              {categoriesLoading ? (

                <CustomLoading title={t('home.categoriesLoading')} />
              ) : (
                <View>
                  {categories && categories.map((category: any) => (
                    <HomeBtnItem
                      key={category.id}
                      title={i18n.language === 'ar' ? category.title_ar : category.title_en}
                      image={category.image}
                      count={category.subcategories.length || 0}
                      // onPress={() =>
                      //   navigation.navigate('categories/subcategories', {
                      //     category: JSON.stringify(category),
                      //   })
                      // }

                      onPress={() => router.push(`/categories/subcategories?category=${encodeURIComponent(JSON.stringify(category))}`)}

                    />
                  ))}
                </View>
              )}
            </View>




            {rejected_ads && rejected_ads.length > 0 || accepted_ads && accepted_ads.length > 0 || pending_ads && pending_ads.length > 0 ? (

              <View className='bg-white my-1'>
                <Text className={` p-2 ${i18n.language === 'ar' ? 'text-right arabic-font' : ''} `}>{t('home.ads')}</Text>

                {rejected_ads && rejected_ads.length > 0 ? (
                  <HomeBtnItem
                    onPress={() => router.push(`/ads/rejected?ads=${encodeURIComponent(JSON.stringify(rejected_ads))}`)}
                    title={t('home.rejectedads')}
                    image={rejected}
                    count={rejected_ads && rejected_ads.length || 0}
                  />
                ) : (null)}



                {accepted_ads && accepted_ads.length > 0 ? (
                  <HomeBtnItem
                    onPress={() => router.push(`/ads/approved?ads=${encodeURIComponent(JSON.stringify(accepted_ads))}`)}
                    title={t('home.approvedads')}
                    image={approved}
                    count={accepted_ads && accepted_ads.length || 0}
                  />
                ) : (null)}


                {pending_ads && pending_ads.length > 0 ? (
                  <HomeBtnItem
                    onPress={() => router.push(`/ads/approved?ads=${encodeURIComponent(JSON.stringify(pending_ads))}`)}
                    title={t('home.approvedads')}
                    image={approved}
                    count={pending_ads && pending_ads.length || 0}
                  />
                ) : (null)}



              </View>

            ) : (null)}









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




    </SafeAreaView>
  )
}
