import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Image, TouchableOpacity, ScrollView } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const PostItemScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    const user = auth().currentUser;
    if (user) {
      setUserName(user.displayName || 'User');
    }
  }, []);

  const selectImage = () => {
    const options = { mediaType: 'photo', quality: 0.5, selectionLimit: 3 };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User canceled image picker');
      } else if (response.errorCode) {
        console.error('Image picker error:', response.errorMessage);
      } else {
        const source = { uri: response.assets[0].uri };
        setImage(source.uri);
      }
    });
  };

  const handlePost = async () => {
    if (!title || !description || !location || !image) {
      Alert.alert('Validation Error', 'Please fill in all fields and select an image.');
      return;
    }

    const user = auth().currentUser;
    if (!user) {
      Alert.alert('Authentication Error', 'You must be logged in to post an item.');
      return;
    }

    const newItem = {
      image,
      title,
      description,
      location,
      date: new Date().toISOString(),
      userId: user.uid,
      userName,
    };

    try {
      await firestore().collection('posts').add(newItem);
      Alert.alert('Success', 'Your post has been added!');
      setTitle('');
      setDescription('');
      setLocation('');
      setImage(null);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to post item. Please try again.');
      console.error('Error adding document:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>POST AN ITEM</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter item title"
          placeholderTextColor="#888"
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter item description"
          placeholderTextColor="#888"
          multiline
        />

        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          value={location}
          onChangeText={setLocation}
          placeholder="Enter location"
          placeholderTextColor="#888"
        />
      </View>

      <View style={styles.imageContainer}>
        <Text style={styles.label}>Image</Text>
        <TouchableOpacity style={styles.imageInputBox} onPress={selectImage}>
          <Text style={styles.imageInputText}>{image ? 'Change Image' : 'Upload Image'}</Text>
        </TouchableOpacity>
        {image && <Image source={{ uri: image }} style={styles.selectedImage} />}
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handlePost}>
        <Text style={styles.submitButtonText}>Submit Post</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 8,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    
  },heading: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#8E44AD',
    marginBottom: 16,
    
    textShadowRadius: 3,
    backgroundColor: '#EDE7F6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 6,
    color: '#34495E',
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
  },
  input: {
    borderColor: '#BDC3C7',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#F9F9F9',
    color: '#2C3E50',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imageContainer: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
  },
  imageInputBox: {
    borderColor: '#BDC3C7',
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    backgroundColor: '#ECF0F1',
  },
  imageInputText: {
    color: '#34495E',
    fontSize: 16,
  },
  selectedImage: {
    width: '100%',
    height: 220,
    borderRadius: 8,
    marginTop: 12,
    resizeMode: 'cover',
  },
  submitButton: {
    backgroundColor: '#8E44AD',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});


export default PostItemScreen;
