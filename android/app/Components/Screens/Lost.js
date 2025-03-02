import { StyleSheet, Text, View,TouchableOpacity } from 'react-native'
import React from 'react'

const Lost = ({navigation}) => {
  return (
    <View>
      <Text>Lost</Text>
      <TouchableOpacity         onPress={() => navigation.navigate('Home')}
      >
        <Text>BAck</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Lost

const styles = StyleSheet.create({})