import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import Entypo from '@expo/vector-icons/Entypo';

export default function HomeBtnItem({ title, onPress, image , count }: any) {
     const firstLetter = title ? title.charAt(0).toUpperCase() : '';
    return (
        <TouchableOpacity
            onPress={onPress}
            className='flex flex-row justify-between items-center bg-white  py-5 px-3 border-b border-gray-300'>
            <View className='flex flex-row items-center'>
                <Entypo name="chevron-left" size={24} color="black" />
                <Text className='mx-2'>{count}</Text>
            </View>
            <View className='flex flex-row items-center'>
                <Text className=' mx-2 arabic-font-semibold'>{title}</Text>
                
                {image ? (
                    <Image
                    // source={{ uri: `${image}` }}
                    source={typeof image === 'string' ? { uri: image } : image}
                    style={{ width: 40, height: 40 }}
                    resizeMode="contain"
                />
                ):(
                <View
                        className="w-10 h-10 rounded-lg bg-primary p-3 flex items-center justify-center"
                    >
                        <Text className="text-white arabic-font-semibold text-md ">
                            {firstLetter}
                        </Text>
                    </View>
            
            )}
            </View>
            
        </ TouchableOpacity>
    )
}
