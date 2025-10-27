import React from 'react'
import { View } from 'react-native'


export default function HomeBtnSkeleton() {
    return (
        <View className='flex flex-row justify-between items-center bg-gray-200  py-5 px-3 border-b border-gray-300'>
            <View className='w-full h-20 bg-gray-200 rounded-full'></View>
            <View className='flex-1 mx-2'>
                <View className='h-4 bg-gray-200 rounded'></View>
                <View className='h-4 bg-gray-200 rounded mt-2'></View>
            </View>
        </View>
    )
}
