import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Modal, FlatList, Pressable, Image } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Ionicons } from '@expo/vector-icons'

interface MultiSelectOption {
    label: string
    value: string
    image?: string
}

interface CustomMultiSelectProps {
    label?: string
    placeholder?: string
    value?: string[] // Array of selected values
    onSelect?: (values: string[]) => void
    options: MultiSelectOption[]
    error?: string
    disabled?: boolean
}

export default function CustomMultiSelect({
    label,
    placeholder = "Select options",
    value = [],
    onSelect,
    options,
    error,
    disabled = false
}: CustomMultiSelectProps) {
    const { t, i18n } = useTranslation()
    const [isModalVisible, setIsModalVisible] = useState(false)

    const selectedOptions = options.filter(option => value.includes(option.value))
    const isRTL = i18n.language === 'ar'

    const handleSelect = (selectedValue: string) => {
        let newValues: string[]

        if (value.includes(selectedValue)) {
            // Remove if already selected
            newValues = value.filter(v => v !== selectedValue)
        } else {
            // Add if not selected
            newValues = [...value, selectedValue]
        }

        onSelect?.(newValues)
    }

    const displayText = selectedOptions.length > 0
        ? selectedOptions.map(opt => opt.label).join(', ')
        : placeholder

    return (
        <View className='mb-5'>
            {label && (
                <Text
                    style={{ fontFamily: 'Cairo_400Regular' }}
                    className={`mb-3 text-sm font-medium text-gray-700 ${isRTL ? 'text-right' : 'text-left'}`}
                >
                    {label}
                </Text>
            )}

            <TouchableOpacity
                onPress={() => !disabled && setIsModalVisible(true)}
                disabled={disabled}
                className={`
          border-2 rounded-xl px-4 py-4 w-full
          ${error
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 bg-white'
                    }
          ${disabled ? 'opacity-50 bg-gray-100' : ''}
          shadow-sm flex-row justify-between items-center
        `}
                style={{
                    elevation: 2,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 2,
                }}
            >
                <Text
                    style={{
                        fontFamily: 'Cairo_400Regular',
                        textAlign: isRTL ? 'right' : 'left'
                    }}
                    className={`text-base flex-1 ${selectedOptions.length > 0 ? 'text-gray-900' : 'text-gray-400'
                        }`}
                    numberOfLines={1}
                >
                    {displayText}
                </Text>

                {selectedOptions.length > 0 && (
                    <View className="bg-blue-600 rounded-full px-2 py-1 mr-2">
                        <Text className="text-white text-xs" style={{ fontFamily: 'Cairo_600SemiBold' }}>
                            {selectedOptions.length}
                        </Text>
                    </View>
                )}

                <Ionicons
                    name={isModalVisible ? "chevron-up" : "chevron-down"}
                    size={20}
                    color="#6B7280"
                />
            </TouchableOpacity>

            {error && (
                <View className='flex-row items-center mt-2 px-1'>
                    <Ionicons name="alert-circle" size={12} color="#EF4444" />
                    <Text
                        className='text-red-500 text-xs ml-2 flex-1'
                        style={{ fontFamily: 'Cairo_400Regular' }}
                    >
                        {error}
                    </Text>
                </View>
            )}

            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsModalVisible(false)}
            >
                <Pressable
                    className="flex-1 bg-black/50 justify-center items-center"
                    onPress={() => setIsModalVisible(false)}
                >
                    <Pressable className="bg-white rounded-xl mx-6 max-h-96 w-80">
                        <View className="p-4 border-b border-gray-200">
                            <Text
                                className="text-lg font-semibold text-center text-gray-800"
                                style={{ fontFamily: 'Cairo_600SemiBold' }}
                            >
                                {label || "Select Options"}
                            </Text>
                            {selectedOptions.length > 0 && (
                                <Text
                                    className="text-sm text-center text-gray-500 mt-1"
                                    style={{ fontFamily: 'Cairo_400Regular' }}
                                >
                                    {selectedOptions.length} {t('ad.selected') || 'selected'}
                                </Text>
                            )}
                        </View>

                        <FlatList
                            data={options}
                            keyExtractor={(item) => item.value}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item, index }) => {
                                const isSelected = value.includes(item.value)

                                return (
                                    <TouchableOpacity
                                        onPress={() => handleSelect(item.value)}
                                        className={`
                      px-4 py-4 
                      ${index !== options.length - 1 ? 'border-b border-gray-100' : ''}
                      ${isSelected ? 'bg-blue-50' : ''}
                    `}
                                    >
                                        <View className="flex-row items-center">
                                            {item.image && (
                                                <Image
                                                    source={{ uri: item.image }}
                                                    style={{ width: 32, height: 32, borderRadius: 8, marginRight: 8 }}
                                                    resizeMode="cover"
                                                />
                                            )}
                                            <Text
                                                style={{
                                                    fontFamily: 'Cairo_400Regular',
                                                    textAlign: isRTL ? 'right' : 'left'
                                                }}
                                                className={`text-base flex-1 ${isSelected ? 'text-blue-600 font-medium' : 'text-gray-800'
                                                    }`}
                                            >
                                                {item.label}
                                            </Text>
                                            {isSelected && (
                                                <Ionicons name="checkmark-circle" size={24} color="#2563EB" />
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                )
                            }}
                        />

                        <TouchableOpacity
                            onPress={() => setIsModalVisible(false)}
                            className="p-4 border-t border-gray-200"
                        >
                            <Text
                                className="text-center text-blue-600 font-semibold"
                                style={{ fontFamily: 'Cairo_600SemiBold' }}
                            >
                                {t('ad.done') || 'Done'}
                            </Text>
                        </TouchableOpacity>
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    )
}
