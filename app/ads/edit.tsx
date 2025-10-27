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



    const validationSchema = Yup.object().shape({
        title: Yup.string().required('Meal title is required').min(2, 'Title must be at least 2 characters'),
        description: Yup.string().required('Description is required').min(10, 'Description must be at least 10 characters'),
        price: Yup.number().required('Price is required').positive('Price must be positive').typeError('Please enter a valid price'),
        image: Yup.string().required('Meal image is required')
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
        },
        // validationSchema,
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
                selectedImages.forEach((imgUri) => {
                    const filename = imgUri.split('/').pop() || 'image.jpg'
                    const match = /\.(\w+)$/.exec(filename)
                    const type = match ? `image/${match[1]}` : 'image/jpeg'
                    const imageFile = {
                        uri: imgUri,
                        name: filename,
                        type: type,
                    } as any
                    formData.append('images[]', imageFile)
                })
                await axios.post(
                    `${config.URL}/ad/update/${adData.id}`,
                    formData,
                    {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    }
                )
                Toast.show({ 
                    type: 'success', 
                    text1: t('ad.editsuccess') })
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

    return (
        <View style={{ flex: 1 }} className='pb-20 bg-white'>
            <CustomHeader title={t('ad.edit_ad')} />
            <ScrollView className='px-4 pt-10 pb-44' contentContainerStyle={{ paddingBottom: 40 }}>
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