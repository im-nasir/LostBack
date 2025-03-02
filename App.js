import  React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
// import AppNavigator from './navigation/AppNavigator';
import { ItemsProvider } from './android/app/Components/Screens/ItemsContext';
import Navigation from './android/app/Components/Navigation/Navigation1';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import firestore from '@react-native-firebase/firestore';


function App() {
  return (
    <ItemsProvider>
     <Navigation>
      
     </Navigation>
  </ItemsProvider>
  
  

  );
}

// const styles = StyleSheet.create({
//   header: {
//     fontSize: 50,
//     fontWeight: 'bold',
//     fontFamily: 'Roboto-Regular',  // Custom font applied
//   },
//   body: {
//     fontSize: 16,
//     fontFamily: 'Lato-Regular',  // Another custom font
//   },
// });


export default App;