import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';

const Screen1 = ({ navigation }) => {
  const [currentPage, setCurrentPage] = useState(2);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <View style={styles.view}>
       <View style={styles.textView}>
         <Text style={styles.text1}>
          Someone Finds the Item !
         </Text>
       </View>

       <View style={styles.ImageView}>
       <Image style={styles.Image1}
       source={require('../Theme/Images/Image2.png')}/>
       </View>
       
      <View style={styles.nextBtnView}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Screen3')}
        style={styles.btnnext}>
       <Image
       style={styles.btnimg}
       source={require('../Theme/Images/arrowback.png')}
       />
      </TouchableOpacity>
      </View>
        
       
      
     
      <View style={styles.nextProg}>
        <Text
          style={{
            color: currentPage === 1 ? '#8A4FFF' : 'lightgrey',
            fontSize: 14,
            margin:2,
            marginLeft:5
          }}
          onPress={() => handlePageChange(1)}>
          ⬤
        </Text>
        <Text
          style={{
            color: currentPage === 2 ? '#8A4FFF' : 'lightgrey',
            fontSize: 14,
            margin:2,
            marginLeft:0
          }}
          onPress={() => handlePageChange(2)}>
          ⬤
        </Text>
        <Text
          style={{
            color: currentPage === 3 ? '#8A4FFF' : 'lightgrey',
            fontSize: 14,
            margin:2,
            marginLeft:0
          }}
          onPress={() => handlePageChange(3)}>
          ⬤
        </Text>
      </View>
    
    </View>
  );
};

export default Screen1;

const styles = StyleSheet.create({
 
  view: { 
    flex: 1, 
    alignItems:'center',
    justifyContent:'center',
    backgroundColor: '#FFFFFF' },
  
  textView:{
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  },

  text1: {
    fontSize: 28,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#8A4FFF',
    marginBottom:'12%'
    
  },
  
  nextBtnView:{
    flex:1,
    justifyContent:'flex-end',
    paddingBottom:'2%'

  },
  btnnext: {
    height: 70,
    width: 70,
    alignSelf: 'center',
    borderRadius: 70,
    borderWidth: 5,
    borderColor: '#8A4FFF',

  },
  btnimg:{
  alignSelf:'center',
  marginTop:'33%',
  height:'35%',
  width:'35%'
  },
  ImageView:{
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  },
  Image1:{
   marginTop:'16'
  },
  nextProg:{
  flexDirection: 'row', 
  alignSelf: 'center', 
  paddingBottom:'4'
   }
  
});
