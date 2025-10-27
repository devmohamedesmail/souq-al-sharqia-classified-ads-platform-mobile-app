import React, { useState, useContext } from 'react'
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, StatusBar, TouchableOpacity, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import CustomInput from '@/components/custom/custominput'
import { AuthContext } from '@/context/auth_context'
import AuthHeader from '@/components/auth_header'
import CustomButton from '@/components/custom/custombutton'

import { Toast } from 'toastify-react-native'
import { useRouter } from 'expo-router'


interface RegisterFormValues {
    name: string
    email: string
    password: string

}

export default function Register() {
    const { t, i18n } = useTranslation()
    const [isLoading, setIsLoading] = useState(false)
    const { handle_register } = useContext(AuthContext)
    const router = useRouter()
  


    const validationSchema = Yup.object({
        name: Yup.string()
            .required(t('auth.name_required')),
        email: Yup.string()
            .email(t('auth.email_invalid'))
            .required(t('auth.email_required')),
        password: Yup.string()
            .min(6, t('password_min'))
            .required(t('password_required')),

    })

    const formik = useFormik<RegisterFormValues>({
        initialValues: {
            name: '',
            email: '',
            password: '',

        },
        validationSchema,
        onSubmit: async (values) => {
            setIsLoading(true)

            try {

                const result = await handle_register(values.name, values.email, values.password)
                if (result.success) {

                    Toast.show({
                        type: 'success',
                        text1: t('auth.registration_success'),
                        position: 'top',
                        visibilityTime: 3000,
                    });
                    router.push('/')
                } else {
                    Toast.show({
                        type: 'error',
                        text1: t('auth.registration_failed'),
                        position: 'top',
                        visibilityTime: 3000,
                    });

                }


            } catch (error) {
                Toast.show({
                    type: 'error',
                    text1: t('auth.registration_failed'),
                    position: 'top',
                    visibilityTime: 3000,
                });
            } finally {
                setIsLoading(false)
            }
        }
    })



    return (
        <View className="flex-1 bg-gradient-to-br from-blue-900 via-purple-900 to-black">
            <StatusBar barStyle="light-content" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                >

                    <AuthHeader />

                    {/* Registration Form */}
                    <View className="flex-1 bg-white rounded-t-[32px] px-6 pt-6">
                        <View className="mb-6">
                            <Text className="text-2xl text-center arabic-font text-gray-800 mb-2">
                                {t('auth.createAccount')}
                            </Text>
                        </View>

                        {/* Name Input */}
                        <CustomInput
                            label={t('auth.name')}
                            placeholder={t('auth.enterName')}
                            type="text"
                            value={formik.values.name}
                            onChangeText={formik.handleChange('name')}

                            error={formik.touched.name && formik.errors.name ? formik.errors.name : undefined}
                        />

                        {/* Phone Number Input */}
                        <CustomInput
                            label={t('auth.email')}
                            placeholder={t('auth.enteremail')}
                            type="phone"
                            value={formik.values.email}
                            onChangeText={formik.handleChange('email')}
                            error={formik.touched.email && formik.errors.email ? formik.errors.email : undefined}
                        />

                        {/* Password Input */}
                        <CustomInput
                            label={t('auth.password')}
                            placeholder={t('auth.enterPassword')}
                            type="password"
                            value={formik.values.password}
                            onChangeText={formik.handleChange('password')}
                            error={formik.touched.password && formik.errors.password ? formik.errors.password : undefined}
                        />



                        <CustomButton
                            title={isLoading ? t('auth.wait') : t('auth.next')}
                            onPress={() => formik.handleSubmit()}
                            disabled={isLoading || !formik.isValid || !formik.dirty || !formik.values.email || !formik.values.password}
                            icon={<Ionicons name="arrow-forward" size={20} color="white" />}
                        />







                        {/* Terms and Sign In Link */}
                        <View className="mb-6">


                            <View className="flex-row justify-center items-center">
                                <Text className="text-gray-600">{t('auth.alreadyHaveAccount')} </Text>
                                <TouchableOpacity onPress={() => router.push('/auth/login')}>
                                    <Text className="text-blue-600 font-bold">{t('auth.signIn')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>



                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    )
}
