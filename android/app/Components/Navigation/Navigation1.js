import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';

// Screens
import Signup from '../Screens/Signup';
import Login from '../Screens/Login';
import Home from '../Screens/Home';
import SplashScreenComponent from '../Screens/SplashScreen'; // Splash Screen
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
            iconName = "home";
          } else if (route.name === 'PostItemScreen') {
            iconName = 'plus';
          } else if (route.name === 'MyPostsScreen') {
            iconName = 'list';
          } else if (route.name === 'Profile') {
            iconName = 'user';
          }

          return <FontAwesomeIcon name={iconName} size={focused ? 24 : 20} color={focused ? '#8A4FFF' : 'gray'} />;
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadApp = async () => {
      await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate splash screen for 3 seconds
      setIsLoading(false);
    };
    loadApp();
  }, []);

  if (isLoading) {
    return <SplashScreenComponent />; // Show Splash Screen first
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
        <Stack.Screen name="ItemDetails" component={ItemDetailsScreen} />
        <Stack.Screen name="MainTabs" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
