import { StyleSheet, } from 'react-native';
import React from 'react';
import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';

import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5'; // Import FontAwesome

// Screens
import Signup from '../Screens/Signup';
import Login from '../Screens/Login';
import Home from '../Screens/Home';
import Splash from '../Screens/Splash';
import Lost from '../Screens/Lost';
import FindItem from '../Screens/FindItem';
import ItemDetailsScreen from '../Screens/ItemDetails';
import PostItemScreen from '../Screens/PostItemScreen';
import MyPostsScreen from '../Screens/MyPostScreen';
import Screen1 from '../Screens/Screen1';
import Screen2 from '../Screens/Screen2';
import Screen3 from '../Screens/Screen3';
import Profile from '../Screens/Profile';
import ForgetPassword from '../Screens/ForgetPassword';


// Create Stack and Tab Navigators
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = "home"  // FontAwesome 'home' icon
          } else if (route.name === 'PostItemScreen') {
            iconName = 'plus'; // FontAwesome 'plus-circle' icon
          } else if (route.name === 'MyPostsScreen') {
            iconName = 'list'; // FontAwesome 'list' icon
          }else if (route.name === 'Profile') {
            iconName = 'user'; // FontAwesome 'list' icon
          }

          // Return the FontAwesome icon
          return (
            <FontAwesomeIcon
              name={iconName}
              size={focused ? 24 : 20}
              color={focused ? '#8A4FFF' : 'gray'}
            />
          );
        },
        tabBarStyle: { backgroundColor: '#FFFFFF' },
        tabBarLabelStyle: { fontSize: 12 },
        tabBarActiveTintColor: '#8A4FFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="PostItemScreen" component={PostItemScreen} options={{ title: 'Post Item' }} />
      <Tab.Screen name="MyPostsScreen" component={MyPostsScreen} options={{ title: 'My Posts' }} />
      <Tab.Screen name="Profile" component={Profile} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
};

// Main Navigation
const Navigation = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem('hasLaunched');
        if (hasLaunched === null) {
          // First launch: set flag
          await AsyncStorage.setItem('hasLaunched', 'true');
          setIsFirstLaunch(true);
        } else {
          setIsFirstLaunch(false);
        }
      } catch (error) {
        console.error('Error checking first launch:', error);
      }
    };

    checkFirstLaunch();
  }, []);

  if (isFirstLaunch === null) {
    // Render nothing or a loading spinner while checking AsyncStorage
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isFirstLaunch ? (
          // Show splash and onboarding screens on first launch
          <>
            <Stack.Screen name="Splash" component={Splash} />
            <Stack.Screen name="Screen1" component={Screen1} />
            <Stack.Screen name="Screen2" component={Screen2} />
            <Stack.Screen name="Screen3" component={Screen3} />
            
          </>
        ) : (
          // Skip onboarding for subsequent launches
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Signup" component={Signup} />
            <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
            <Stack.Screen name="ItemDetails" component={ItemDetailsScreen} />
            <Stack.Screen name="MainTabs" component={TabNavigator}  />

          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;

const styles = StyleSheet.create({});
