import React, { useContext, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert, StatusBar } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { AuthContext } from '@/context/auth_context'
import CustomHeader from '@/components/custom/customheader'
import AccountBtnItem from '@/items/accountbtnitem'
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Toast } from 'toastify-react-native'
import axios from 'axios'
import { config } from '@/constants/config'
import Constants from 'expo-constants';
import * as Application from 'expo-application';

interface SettingItem {
  id: string
  title: string
  subtitle?: string
  icon: string
  type: 'toggle' | 'navigation' | 'action' | 'language'
  value?: boolean
  action?: () => void
}

export default function Account() {
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const { auth, logout } = useContext(AuthContext)






  const toggleLanguage = () => {
    const newLanguage = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLanguage);
  };


  const nextLanguage = i18n.language === 'ar' ? 'English' : 'العربية';



  const handle_logout = async () => {
    try {
      Alert.alert(
        t('account.logout'),
        t('account.confirm_logout'),
        [
          { text: t('account.cancel'), style: 'cancel' },
          {
            text: t('account.confirm'),
            style: 'destructive',
            onPress: async () => {
              await logout();
              Toast.show({
                type: 'success',
                text1: t('account.successlogout')
              })

              setTimeout(() => {
                router.push('/');
              }, 3000)
            }
          }
        ]
      );
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: t('account.failedlogout')
      })
    }
  };




  const handle_delete_account = async (id: any) => {
    try {
      Alert.alert(
        t('account.delete'),
        t('account.confirm_delete'),
        [
          { text: t('account.cancel'), style: 'cancel' },
          {
            text: t('account.confirm'),
            style: 'destructive',
            onPress: async () => {
              const response = await axios.get(`${config.URL}/delete/${id}`)
              console.log(response);
              await logout();


              Toast.show({
                type: 'success',
                text1: t('account.successdelete')
              })

              setTimeout(() => {
                router.push('/');
              }, 3000)
            }
          }
        ]
      );
    } catch (error) {

      Toast.show({
        type: 'error',
        text1: t('account.faileddeleted')
      })
    }

  }

  return (
    <View className="flex-1 bg-gray-50">
      <CustomHeader title={t('account.settings')} />
      {/* Settings Content */}
      <ScrollView className="flex-1">
        {/* Profile Section */}
        {auth ? (
          <View className="bg-white mx-4 mt-4 rounded-xl shadow-sm">
            <View className="p-6 items-center border-b border-gray-100">
              <View className="w-20 h-20 bg-blue-600 rounded-full items-center justify-center mb-3">
                <Ionicons name="person" size={32} color="white" />
              </View>
              <Text
                className="text-lg font-bold text-gray-800"
                style={{ fontFamily: 'Cairo_700Bold' }}
              >
                {auth.user.name}
              </Text>
              <Text
                className="text-gray-500 mt-1"
                style={{ fontFamily: 'Cairo_400Regular' }}
              >
                {auth.user.email}
              </Text>
            </View>

            {/* <TouchableOpacity
              className="p-4 flex-row items-center justify-between"
              onPress={() => Alert.alert(t('coming_soon'), t('feature_coming_soon'))}
            >
              <View className="flex-row items-center">
                <Ionicons name="create-outline" size={20} color="#3B82F6" />
                <Text
                  className="text-blue-600 font-medium ml-3"
                  style={{ fontFamily: 'Cairo_600SemiBold' }}
                >
                  {t('auth.edit_profile')}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity> */}
          </View>
        ) : (
          <View className="bg-white mx-4 mt-4 rounded-xl shadow-sm">
            <View className="p-6 items-center border-b border-gray-100">
              <View className="w-20 h-20 bg-blue-600 rounded-full items-center justify-center mb-3">
                <Ionicons name="person" size={32} color="white" />
              </View>
              <Text
                className={`text-lg  text-gray-800 ${i18n.language === 'ar' ? 'arabic-font' : ''}`}
                style={{ fontFamily: 'Cairo_700Bold' }}
              >
                {t('account.guest_user')}
              </Text>

            </View>


          </View>
        )}




        <View className='bg-white mt-6 rounded-xl shadow-sm'>
          {/* <Text>{t("account.share_description")}</Text> */}
          <AccountBtnItem title={`${t('account.changeto')} ${nextLanguage}`} onPress={toggleLanguage} />

        </View>



        <View className='bg-white mt-6 rounded-xl shadow-sm'>
          {/* <Text>{t("account.share_description")}</Text> */}
          <AccountBtnItem
            onPress={() => router.push('/contact')}
            title={t("account.contactus")} />


          <AccountBtnItem
            onPress={() => router.push('/privacy')}
            title={t("account.privacy_policy")} />
          {/* <AccountBtnItem title={t("account.share")} /> */}
        </View>





        {auth ? (
          <View className='bg-white mt-6 rounded-xl shadow-sm p-4'>
            <TouchableOpacity
              onPress={handle_logout}
              className='bg-primary mt-4 rounded-xl shadow-sm'>
              <View className='flex flex-row justify-center items-center p-4'>
                <SimpleLineIcons name="logout" size={24} color="white" />
                <Text className='mx-2 arabic-font-semibold text-white'>{t("account.logout")}</Text>

              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handle_delete_account(auth?.user?.id)}
              className='bg-red-700 mt-4 rounded-xl shadow-sm'>
              <View className='flex flex-row justify-center items-center p-4'>
                <Feather name="trash" size={24} color="white" />
                <Text className='mx-2 text-lg arabic-font-semibold text-white'>{t("account.delete_account")}</Text>

              </View>
            </TouchableOpacity>

          </View>
        ) : (
          <>
            <View className='p-2'>
              <TouchableOpacity
                onPress={() => router.push('/auth/login')}
                className='bg-green-700 mt-4 rounded-xl shadow-sm'>
                <View className='flex flex-row justify-center items-center p-4'>
                  <MaterialCommunityIcons name="account-edit-outline" size={24} color="white" />
                  <Text className='mx-2 text-lg arabic-font-semibold text-white'>{t("auth.signUp")}</Text>

                </View>
              </TouchableOpacity>
            </View>
          </>
        )}




        {/* App Version */}
        <View className="items-center py-8 mb-10">
          <Text
            className="text-gray-400 text-sm"
            style={{ fontFamily: 'Cairo_400Regular' }}
          >
            {t('account.app_version')} 
            {/* {Constants.systemVersion} */}
            {Application.nativeBuildVersion}
          
            
          </Text>
        </View>
      </ScrollView>
    </View>
  )
}
