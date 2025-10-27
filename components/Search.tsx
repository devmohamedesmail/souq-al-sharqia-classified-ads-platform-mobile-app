import React, { useState } from 'react'
import { TextInput, View } from 'react-native'
import Feather from '@expo/vector-icons/Feather';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';

export default function Search() {
    const { t } = useTranslation();
    const [query, setQuery] = useState('');
    const router = useRouter();


    const handleSubmit = () => {
        if (query.trim() !== '') {
            router.push({
                pathname: '/search',
                params: { q: query },
            });
        }
    };


    return (
        <View className='flex flex-row h-16 px-4 justify-between border-b border-gray-300 bg-white items-center'>
            <TextInput
                placeholder={t('home.searchplaceholder')}
                className='text-right flex-1 arabic-font-semibold '
                onChangeText={text => setQuery(text)}
                value={query}
                onSubmitEditing={handleSubmit} // ⬅️ لما المستخدم يضغط Enter
                returnKeyType="search"
            />
            <Feather name="search" size={24} color="black" />
        </View>
    )
}
