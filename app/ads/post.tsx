import React, { useContext, useEffect, useState } from 'react'
import { View, ScrollView, Text, TouchableOpacity } from 'react-native'

import { useRouter } from 'expo-router';
import CustomHeader from '@/components/custom/customheader';
import { useTranslation } from 'react-i18next';
import CustomImagePicker from '@/components/custom/customimagepicker';
import { Toast } from 'toastify-react-native'
import axios from 'axios'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import CustomInput from '@/components/custom/custominput';
import CustomTextArea from '@/components/custom/customtextarea';
import CustomButton from '@/components/custom/custombutton';
import useFetch from '@/hooks/useFetch';
import CustomDropdown from '@/components/custom/customdropdown';
import { config } from '@/constants/config';
import { AuthContext } from '@/context/auth_context';
import { useDeviceId } from '@/hooks/useDeviceId';
import { useNetwork } from '@/context/NetworkProvider';
import OfflineBanner from '@/components/OfflineBanner';
import { Ionicons } from '@expo/vector-icons';
import CustomMultiSelect from '@/components/custom/custommultiselect';


export default function PostAd() {
    const router = useRouter();
    const { t, i18n } = useTranslation();
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { data, loading, error } = useFetch('/categories')
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
    const { auth } = useContext(AuthContext)
    const { deviceId, shortDeviceId, isLoading } = useDeviceId();
    const { isConnected } = useNetwork();
    const [agreementChecked, setAgreementChecked] = useState(false);
    const [placesData, setPlacesData] = useState<any[]>([]);
    const [selectedPlaces, setSelectedPlaces] = useState<string[]>([]);




    const fetchplaces = async () => {
        try {
            const response = await axios.get(`${config.URL}/places`);
            setPlacesData(response.data);
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: t('ad.error'),
                text2: t('ad.please_try_again'),
                position: 'top',
            })
        }
    }
    useEffect(() => {
        fetchplaces()
    }, [])





    const validationSchema = Yup.object().shape({
        title: Yup.string()
            .required(t('ad.titleRequired'))
            .min(2, t('ad.titleMin', { count: 2 })),
        description: Yup.string()
            .required(t('ad.descriptionRequired'))
            .min(10, t('ad.descriptionMin', { count: 10 })),
        phone: Yup.string()
            .required(t('ad.phoneRequired'))
            .matches(/^[0-9]+$/, t('ad.phoneInvalid'))
            .min(8, t('ad.phoneTooShort'))
            .max(15, t('ad.phoneTooLong')),

        name: Yup.string()
            .required(t('ad.nameRequired'))
            .min(2, t('ad.nameMin', { count: 2 })),
        email: Yup.string()
            .email(t('ad.emailInvalid')),
        // .required(t('ad.emailRequired')),
        category: Yup.string()
            .required(t('ad.categoryRequired')),
        subcategory: Yup.string()
            .when('category', ([category], schema) => {
                return category
                    ? schema.required(t('ad.subcategoryRequired'))
                    : schema.notRequired();
            }),
        agreement: Yup.boolean()
            .oneOf([true], t('ad.agreementRequired')),
    })



    const formik = useFormik({
        initialValues: {
            title: '',
            description: '',
            price: '',
            image: '',
            phone: '',
            name: '',
            email: '',
            category: '',
            subcategory: '',
            agreement: false,
            places: [],
        },
        validationSchema,
        onSubmit: async (values) => {
            setIsSubmitting(true)

            try {
                const formData = new FormData()
                formData.append('user_id', auth?.user.id || shortDeviceId || ''); // Use deviceId as fallback
                formData.append('category_id', selectedCategory || '');
                formData.append('subcategory_id', selectedSubcategory || '');
                formData.append('name', values.name || '');
                formData.append('email', values.email || '');
                formData.append('phone', values.phone || '');
                formData.append('price', values.price || '');
                formData.append('title', values.title || '');
                formData.append('description', values.description || '');

                selectedPlaces.forEach((placeId) => {
                    formData.append('places[]', placeId);
                });

                selectedImages.forEach((imgUri) => {
                    const filename = imgUri.split('/').pop() || 'image.jpg';
                    const match = /\.(\w+)$/.exec(filename);
                    const type = match ? `image/${match[1]}` : 'image/jpeg';
                    const imageFile = {
                        uri: imgUri,
                        name: filename,
                        type: type,
                    } as any;
                    formData.append('images[]', imageFile);
                });



                const response = await axios.post(
                    `${config.URL}/post/ad`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                )

                if (response.status == 201) {
                    Toast.show({
                        type: 'success',
                        text1: t('ad.success')
                    })


                    formik.resetForm();
                    setSelectedImages([]);
                    setSelectedCategory(null);
                    setSelectedSubcategory(null);
                    setAgreementChecked(false);
                    setSelectedPlaces([]);

                } else {
                    Toast.show({
                        type: 'error',
                        text1: t('ad.failed')
                    })
                }


                // router.back()
            } catch (error: any) {
                Toast.show({
                    type: 'error',
                    text1: t('ad.failed')
                })
            } finally {
                setIsSubmitting(false)
            }
        },
    })


    // Prepare category options with image
    const categoryOptions = Array.isArray(data)
        ? data.map((cat: any) => ({
            label: i18n.language === 'ar' ? cat.title_ar : cat.title_en,
            value: String(cat.id),
            image: cat.image,
        }))
        : []

    // Prepare subcategory options with image (if available)
    const categoryObj = data?.find((cat: any) => String(cat.id) === selectedCategory)
    const subcategoryOptions = categoryObj?.subcategories
        ? categoryObj.subcategories
            .filter((sub: any) => sub && sub.id)
            .map((sub: any) => ({
                label: i18n.language === 'ar' ? sub.title_ar : sub.title_en,
                value: String(sub.id),
                image: sub.image,
            }))
        : []


    const placeOptions = Array.isArray(placesData)
        ? placesData.map((place: any) => ({
            label: i18n.language === 'ar' ? place.name_ar : place.name_en,
            value: String(place.id),
        }))
        : []

    return (
        <View style={{ flex: 1 }} className='pb-20 bg-white '>

            <CustomHeader title={t('home.postad')} />

            {isConnected  && placesData.length > 0 ? (
                <ScrollView className='  pb-44 ' contentContainerStyle={{ paddingBottom: 40 }}>



                    <View className=' bg-white p-3 px-5'>
                        <Text className={`text-primary text-xl mb-10  ${i18n.language === "ar" ? 'text-right arabic-font' : 'text-left'}`}>{t('ad.ad_details')}</Text>





                        <CustomMultiSelect
                            label={t('ad.selectPlace')}
                            placeholder={t('ad.selectPlacePlaceholder')}
                            value={selectedPlaces}
                            onSelect={(values) => {
                                setSelectedPlaces(values);
                                formik.setFieldValue('places', values);
                            }}
                            options={placeOptions}
                            error={
                                formik.touched.places && formik.errors.places
                                    ? typeof formik.errors.places === 'string'
                                        ? formik.errors.places
                                        : formik.errors.places[0] // Get first error if it's an array
                                    : undefined
                            }
                        />



                        <CustomDropdown
                            label={t('ad.selectCategory')}
                            placeholder={t('ad.selectCategoryPlaceholder')}
                            value={selectedCategory as any}
                            onSelect={(val) => {
                                setSelectedCategory(val)
                                setSelectedSubcategory(null)
                                formik.setFieldValue('category', val)
                            }}
                            options={categoryOptions}
                        />

                        {selectedCategory && subcategoryOptions.length > 0 && (
                            <CustomDropdown
                                label={t('ad.selectSubcategory')}
                                placeholder={t('ad.selectSubcategoryPlaceholder')}
                                value={selectedSubcategory as any}
                                onSelect={(val) => {
                                    setSelectedSubcategory(val)
                                    formik.setFieldValue('subcategory', val)
                                }}
                                options={subcategoryOptions}
                            />
                        )}







                        <CustomImagePicker
                            label={t("ad.selectImage")}
                            placeholder={t("ad.taptoselectimage")}
                            changeText={t("ad.taptoselectimage")}
                            value={selectedImages}
                            onImageSelect={(uris) => {
                                setSelectedImages(uris);
                                formik.setFieldValue('image', uris);
                            }}
                            error={formik.touched.image && formik.errors.image ? formik.errors.image : undefined}
                        />


                        <CustomInput
                            label={t('ad.adlabel')}
                            value={formik.values.title}
                            onChangeText={formik.handleChange('title')}
                            placeholder={t("ad.titlePlaceholder")}
                            error={formik.touched.title && formik.errors.title ? formik.errors.title : undefined}
                        />

                        <CustomTextArea
                            value={formik.values.description}
                            label={t('ad.description')}
                            onChangeText={formik.handleChange('description')}
                            placeholder={t("ad.descriptionPlaceholder")}
                            error={formik.touched.description && formik.errors.description ? formik.errors.description : undefined}
                        />


                        <CustomInput
                            label={t('ad.price')}
                            value={formik.values.price}
                            onChangeText={formik.handleChange("price")}
                            placeholder={t("ad.price")}
                        />


                    </View>




                    <View className=' bg-white p-3 '>
                        <Text className={`text-primary text-xl mb-5 ${i18n.language === "ar" ? 'text-right arabic-font' : 'text-left'}`}>{t('ad.publisher_info')}</Text>
                        <CustomInput
                            label={t('ad.name')}
                            value={formik.values.name}
                            onChangeText={formik.handleChange('name')}
                            placeholder={t("ad.name")}
                            error={formik.touched.name && formik.errors.name ? formik.errors.name : undefined}
                        />
                        <CustomInput
                            label={t('ad.phone')}
                            value={formik.values.phone}
                            onChangeText={formik.handleChange("phone")}
                            placeholder={t("ad.phone")}
                            error={formik.touched.phone && formik.errors.phone ? formik.errors.phone : undefined}
                        />

                        <CustomInput
                            label={t('ad.email')}
                            value={formik.values.email}
                            onChangeText={formik.handleChange("email")}
                            placeholder={t("ad.email")}
                            error={formik.touched.email && formik.errors.email ? formik.errors.email : undefined}
                        />
                    </View>



                    <View className='bg-white p-5 mb-4'>
                        <TouchableOpacity
                            onPress={() => {
                                const newValue = !agreementChecked;
                                setAgreementChecked(newValue);
                                formik.setFieldValue('agreement', newValue);
                            }}
                            className='flex-row items-start'
                        >
                            <View className={`w-6 h-6 border-2 rounded mr-3 mt-1 items-center justify-center ${agreementChecked ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                                {agreementChecked && (
                                    <Ionicons name="checkmark" size={16} color="white" />
                                )}
                            </View>
                            <Text
                                className={`flex-1 text-gray-700 leading-6 ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}
                                style={{ fontFamily: 'Cairo_400Regular' }}
                            >
                                {t('ad.contentPolicyAgreement') || 'أوافق على عدم نشر إعلانات تحتوي على محتوى غير لائق أو مخالف لسياسة المنصة'}
                            </Text>
                        </TouchableOpacity>

                        {formik.touched.agreement && formik.errors.agreement && (
                            <Text
                                className='text-red-500 text-sm mt-2'
                                style={{ fontFamily: 'Cairo_400Regular' }}
                            >
                                {formik.errors.agreement}
                            </Text>
                        )}
                    </View>


                    <View className='px-5'>
                        <CustomButton
                            title={isSubmitting ? t('ad.posting') : t('ad.post_ad')}
                            onPress={formik.handleSubmit}
                            disabled={isSubmitting}
                        />
                    </View>
                </ScrollView>
            ) : (<OfflineBanner />)}




        </View>
    )
}
