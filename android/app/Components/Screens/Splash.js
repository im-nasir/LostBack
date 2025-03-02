import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';




  const Splash = ({ navigation }) => {
    return (
      <ImageBackground style={styles.imgback}
      source={require('../Theme/Images/background.jpg')}
      resizeMode="cover"
      >

     
      <View style={styles.container}>
       
      
       <View style={styles.textView}> 
        <Text style={styles.title}>LostBack</Text>
       </View>

        <View style={styles.nextBtnView}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Screen1')}
              style={styles.btnnext}>
            <Image
            style={styles.btnimg}
            source={require('../Theme/Images/arrowback.png')}
            />
            </TouchableOpacity>
        </View >
          
  
      </View>
      </ImageBackground>
    );
  };
  export default Splash;

const styles = StyleSheet.create({
  imgback:{
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    alignItems:'center',
    backgroundColor: '',
    justifyContent:'center',
  },
  title: {
    width:'100%',
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',

  },
  nextBtnView:{
    flex:1,
    justifyContent:'flex-end',
    padding:'10%'

  },
  btnnext: {
    height: 70,
    width: 70,
    marginTop: '60%',
    alignSelf: 'center',
    borderRadius: 70,
    borderWidth: 5,
    borderColor: '#E5D8FF',

  },
  btnimg:{
alignSelf:'center',
marginTop:'33%',
height:'35%',
width:'35%'
  },
  textView:{
  marginTop:'80%'

  }
});
