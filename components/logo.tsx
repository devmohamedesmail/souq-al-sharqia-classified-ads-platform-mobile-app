import React from 'react'
import { Image, View } from 'react-native'

export default function Logo({width = 100, height = 100}) {
  return (
    <View>
        <Image
          source={require('../assets/images/logo.png')}
          style={{ width: width, height: height }}
        />
    </View>
  )
}
