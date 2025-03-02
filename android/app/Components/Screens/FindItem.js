import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const FindItem = ({navigation}) => {
  return (
    <View>
      <Text>FindItem</Text>
      <TouchableOpacity         onPress={() => navigation.navigate('Home')}
      >
        <Text>BAck</Text>
      </TouchableOpacity>
    </View>
  )
}

export default FindItem

const styles = StyleSheet.create({})
