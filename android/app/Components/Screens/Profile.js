import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const [profilePic, setProfilePic] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const user = auth().currentUser;
  const navigation = useNavigation();

  // Fetch user data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      const doc = await firestore().collection('users').doc(user.uid).get();
      if (doc.exists) {
        const userData = doc.data();
        setName(userData.displayName || '');
        setEmail(userData.email);
        setProfilePic(userData.profilePic || '');
        setGender(userData.gender || '');
        setDob(userData.dateOfBirth || '');
      }
    };
    fetchUserData();
  }, [user]);

  // Image Picker for Profile Picture
  const selectImage = () => {
    const options = { mediaType: 'photo', quality: 0.5 };
  
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User canceled image picker');
      } else if (response.errorCode) {
        console.error('Image picker error:', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const source = { uri: response.assets[0].uri };
        setProfilePic(source.uri); // Use the function to update state
      }
    });
  };
  

  // Update Profile Data in Firestore
  const updateProfile = async () => {
    try {
      await firestore().collection('users').doc(user.uid).update({
        displayName: name,
        profilePic,  // This will now store the URL of the uploaded profile picture
        gender,
        dateOfBirth: dob,
      });
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile.');
    }
  };

  // Logout User
  const logout = async () => {
    try {
      await auth().signOut();
      Alert.alert('Logged out', 'You have successfully logged out.');
      navigation.navigate('Login'); // Navigate back to the login page
    } catch (error) {
      Alert.alert('Error', 'Failed to logout: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
          {/* Profile Picture */}
      <TouchableOpacity onPress={selectImage} style={styles.imageTouchable}>
  <Image
    source={
      profilePic
        ? { uri: profilePic }
        : require('../Theme/Images/profile.jpg')
    }
    style={styles.profilePic}
    onError={() => setProfilePic('')} // Reset to fallback if the URI fails to load
  />
  <Text style={styles.imageOverlayText}>Edit</Text>
</TouchableOpacity>

      </View>
      
  <View style={styles.inputContainer}>
        {/* Name */}
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder=""
        value={name}
        onChangeText={(text) => setName(text)}
      />

      {/* Email */}
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        editable={false} // Email should not be editable
      />

      {/* Gender */}
      <Text style={styles.label}>Gender</Text>
      <TextInput
        style={styles.input}
        placeholder="Male/Female"
        value={gender}
        onChangeText={(text) => setGender(text)}
      />

      {/* Date of Birth */}
      <Text style={styles.label}>Date of Birth</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Date of Birth"
        value={dob}
        onChangeText={(text) => setDob(text)}
      />

  </View>

      
      {/* Update Profile Button */}
      <TouchableOpacity style={styles.updateButton} onPress={updateProfile}>
        <Text style={styles.logoutText}>UPDATE PROFILE</Text>
      </TouchableOpacity>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60, // Circular image
    borderWidth: 2,
    borderColor: '#8A4FFF',
    marginBottom: 20,
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#F9F9F9',
  },
  logoutButton: {
    marginTop: 30,
    paddingVertical: 10,
    paddingHorizontal: 40,
    backgroundColor: '#FF4D4D',
    borderRadius: 8,
  },
  updateButton:{
    backgroundColor:'#8A4FFF',
    marginTop: 0,
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignSelf:'center',
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageOverlayText: {
    position: 'absolute', // Overlay text
    color: '#f3f3f3', // White text for contrast
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
    width: '100%', // Makes the text span the circle's width
    bottom: '2%', // Moves the text slightly up, so it fits inside the circle
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Semi-transparent background to make text more readable
    paddingVertical: 4,
    borderRadius: 10,
    paddingTop:8,
    justifyContent:'flex-end',
  },
  imageContainer: {
    // position: 'relative', // Enables absolute positioning for children
    marginTop: 8,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  imageTouchable: {
    position: 'relative', // Enables absolute positioning for children
    width: 120, // Diameter of the circle
    height: 120, // Diameter of the circle
    borderRadius: 60, // Makes it circular
    overflow: 'hidden', // Ensures children stay within the circle
  },
  inputContainer:{
    alignSelf:'center',
    padding:12,
    marginTop:'15%',
    marginBottom:'10%',
    backgroundColor:'#F3F3F3',
    width:'100%'
  }
});

export default ProfileScreen;