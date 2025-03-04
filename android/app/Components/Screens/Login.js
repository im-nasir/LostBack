import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Button,
  Alert,
} from 'react-native';

import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth'; // Import Firebase Authentication
import LineWithText from '../LineWithText.js';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (email.length > 0 && password.length > 0) {
      try {
        // Sign in using Firebase
        await auth().signInWithEmailAndPassword(email, password);
        Alert.alert('success','Login successful');
        const user = auth().currentUser; // Get the current user
navigation.navigate('MainTabs', { currentUserId: user.uid }); // Ensure currentUserId is passed correctly


      } catch (error) {
        console.error(error);
        Alert.alert('Error','Login failed: ' + error.message); // Show error message
      }
    } else {
      Alert.alert('Please enter your email and password');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.SignupHeader}>
        <Text style={styles.HeadText}>SignIn to your Account</Text>
        <Text style={styles.HeadSubtext}>LogIn to account</Text>
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.input}
          placeholder="Enter Email"
          value={email}
          onChangeText={value => setEmail(value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Password"
          value={password}
          onChangeText={value => setPassword(value)}
          secureTextEntry={true}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleLogin}>
          <Text
            style={{textAlign: 'center', color: 'white', fontWeight: 'bold'}}>
            Login
          </Text>
        </TouchableOpacity>

        {/* Forgot Password */}
        <TouchableOpacity onPress={() => navigation.navigate('ForgetPassword')}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <View style={styles.liineView}>
          <LineWithText text="OR" style={styles.line}/>
        </View>

        <TouchableOpacity style={styles.goglButton} onPress={''}>
          <Image
            style={{ width: 20, height: 20,marginRight:8 }}
            source={require('../Theme/Images/google.png')}
          />
          <Text
            style={{
              textAlign: 'center',
              color: '#1C1C1C',
              fontWeight: 'bold',
            }}
          >
            Continue with Google
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.loginView}>
        <View>
          <Text style={{color: '#000000'}}>Don't have an account?</Text>
        </View>

        <View>
          <TouchableOpacity
            style={styles.signup}
            onPress={() => navigation.navigate('Signup')}>
            <Text style={{color: '#8A4FFF', fontWeight: 'bold'}}> Signup</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    alignItems: 'center',
  },
  inputView: {
    paddingTop: '20%',
    width: '100%',
  },
  input: {
    alignSelf: 'center',
    width: '80%',
    borderRadius: 15,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#1C1C1C',
    padding: 14,
    paddingLeft: 28,
  },
  addButton: {
    backgroundColor: '#8A4FFF',
    padding: 14,
    width: '80%',
    alignSelf: 'center',
    borderRadius: 12,
    marginTop: 4,
  },
  goglButton: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 14,
    paddingBottom: 14,
    width: '80%',
    alignSelf: 'center',
    borderRadius: 12,
    marginTop: 4,
    borderColor: 'lightgrey',
    borderWidth: 1,
  },
  HeadText: {
    paddingTop: '30%',
    fontSize: 40,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'left',
    paddingLeft: 16,
  },
  HeadSubtext: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F5F1EB',
    textAlign: 'left',
    paddingLeft: 16,
    paddingBottom: 16,
  },
  SignupHeader: {
    backgroundColor: '#8A4FFF',
    width: '100%',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    alignItems: 'flex-start', // Fixed
    paddingVertical: 10,
  },
  loginView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: 'lightgrey',
    alignSelf: 'center',
  },
  text: {
    marginHorizontal: 10,
    fontSize: 16,
    color: 'gray',
  },
  liineView: {
    marginLeft: 16, // Fixed
    marginRight: 16, // Fixed
  },
  forgotPasswordText: {
    color: '#6200EE',
    textAlign: 'center',
    marginVertical: 10,
  },
});
