import React, { useState, useEffect, useContext } from 'react'
import { View, ScrollView } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import CustomHeader from '@/components/custom/customheader'
import { useTranslation } from 'react-i18next'
import CustomImagePicker from '@/components/custom/customimagepicker'
import { Toast } from 'toastify-react-native'
import axios from 'axios'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import CustomInput from '@/components/custom/custominput'
import CustomTextArea from '@/components/custom/customtextarea'
import CustomButton from '@/components/custom/custombutton'
import useFetch from '@/hooks/useFetch'
import CustomDropdown from '@/components/custom/customdropdown'
import CustomMultiSelect from '@/components/custom/custommultiselect'
import { config } from '@/constants/config'
import { AuthContext } from '@/context/auth_context';
import { useDeviceId } from '@/hooks/useDeviceId';

export default function EditAd() {
    const router = useRouter()
    const { t, i18n } = useTranslation()
    const { ad } = useLocalSearchParams()
    const adData = ad ? JSON.parse(ad as string) : {}
    const [selectedImages, setSelectedImages] = useState<string[]>(adData.images || [])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { data } = useFetch('/categories')
    const [selectedCategory, setSelectedCategory] = useState<string | null>(adData.category_id ? String(adData.category_id) : null)
    const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(adData.subcategory_id ? String(adData.subcategory_id) : null)
    const { auth } = useContext(AuthContext)
    const { deviceId, shortDeviceId, isLoading } = useDeviceId();
    const [placesData, setPlacesData] = useState<any[]>([]);
    const [selectedPlaces, setSelectedPlaces] = useState<string[]>(adData.places || []);

    const fetchplaces = async () => {
        try {
            const response = await axios.get(`${config.URL}/places`);
            setPlacesData(response.data);
        } catch (error) {
            console.error('Error fetching places:', error);
        }
    }

    useEffect(() => {
        fetchplaces();
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
            places: Yup.array()
                .min(1, t('ad.placesRequired'))
                .required(t('ad.placesRequired')),
            category: Yup.string()
                .required(t('ad.categoryRequired')),
            subcategory: Yup.string()
                .required(t('ad.subcategoryRequired')),
            agreement: Yup.boolean()
                .oneOf([true], t('ad.agreementRequired')),
        })

    const formik = useFormik({
        initialValues: {
            title: adData.title || '',
            description: adData.description || '',
            price: adData.price || '',
            image: adData.images || [],
            phone: adData.phone || '',
            name: adData.name || '',
            email: adData.email || '',
            category: adData.category_id ? String(adData.category_id) : '',
            subcategory: adData.subcategory_id ? String(adData.subcategory_id) : '',
            places: adData.places || [],
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            setIsSubmitting(true)
            try {
                const formData = new FormData()
                formData.append('user_id', auth?.user.id || shortDeviceId || '');
                formData.append('category_id', selectedCategory || '')
                formData.append('subcategory_id', selectedSubcategory || '')
                formData.append('name', values.name || '')
                formData.append('email', values.email || '')
                formData.append('phone', values.phone || '')
                formData.append('price', values.price || '')
                formData.append('title', values.title || '')
                formData.append('description', values.description || '')
                
                selectedPlaces.forEach((placeId) => {
                    formData.append('places[]', placeId);
                });


                selectedImages.forEach((imgUri, index) => {
                    const uriParts = imgUri.split('.');
                    const fileType = uriParts[uriParts.length - 1];

                    formData.append('images[]', {
                        uri: imgUri,
                        name: `photo_${index}.${fileType}`,
                        type: `image/${fileType}`,
                    } as any);
                });


                await axios.post(
                    `${config.URL}/ad/update/${adData.id}`,
                    formData,
                    {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    }
                )
                Toast.show({
                    type: 'success',
                    text1: t('ad.editsuccess')
                })
                router.back()
            } catch (error: any) {
                Toast.show({ type: 'error', text1: t('ad.editfailed') })
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

    // Prepare place options
    const placeOptions = Array.isArray(placesData)
        ? placesData.map((place: any) => ({
            label: i18n.language === 'ar' ? place.name_ar : place.name_en,
            value: String(place.id),
            image: place.image,
        }))
        : []

    return (
        <View style={{ flex: 1 }} className='pb-20 bg-white'>
            <CustomHeader title={t('ad.edit_ad')} />
            <ScrollView className='px-4 pt-10 pb-44' contentContainerStyle={{ paddingBottom: 40 }}>
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
                                : String(formik.errors.places)
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
                    error={formik.touched.category && formik.errors.category ? formik.errors.category : undefined}
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
                        error={formik.touched.subcategory && formik.errors.subcategory ? formik.errors.subcategory : undefined}
                    />
                )}
                <CustomImagePicker
                    label={t("ad.selectImage")}
                    placeholder={t("ad.taptoselectimage")}
                    changeText={t("ad.taptoselectimage")}
                    value={selectedImages}
                    onImageSelect={(uris) => {
                        setSelectedImages(uris)
                        formik.setFieldValue('image', uris)
                    }}
                    error={
                        formik.touched.image && typeof formik.errors.image === 'string'
                            ? formik.errors.image
                            : undefined
                    }
                />
                <CustomInput
                    label={t('ad.adlabel')}
                    value={formik.values.title}
                    onChangeText={formik.handleChange('title')}
                    placeholder={t("ad.titlePlaceholder")}
                />
                <CustomInput
                    label={t('ad.name')}
                    value={formik.values.name}
                    onChangeText={formik.handleChange('name')}
                    placeholder={t("ad.name")}
                />
                <CustomInput
                    label={t('ad.phone')}
                    value={formik.values.phone}
                    onChangeText={formik.handleChange("phone")}
                    placeholder={t("ad.phone")}
                />
                <CustomInput
                    label={t('ad.email')}
                    value={formik.values.email}
                    onChangeText={formik.handleChange("email")}
                    placeholder={t("ad.email")}
                />
                <CustomInput
                    label={t('ad.price')}
                    value={formik.values.price}
                    onChangeText={formik.handleChange("price")}
                    placeholder={t("ad.price")}
                />
                <CustomTextArea
                    value={formik.values.description}
                    label={t('ad.description')}
                    onChangeText={formik.handleChange('description')}
                    placeholder={t("ad.descriptionPlaceholder")}
                />
                <CustomButton
                    title={isSubmitting ? t('ad.updating') : t('ad.update_ad')}
                    onPress={formik.handleSubmit}
                    disabled={isSubmitting}
                />
            </ScrollView>
        </View>
    )
}