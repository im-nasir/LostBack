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
      <Text style={styles.heading}>Post an Item</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Title</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Enter item title" />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter item description"
          multiline
        />

        <Text style={styles.label}>Location</Text>
        <TextInput style={styles.input} value={location} onChangeText={setLocation} placeholder="Enter location" />
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
  container: { flexGrow: 1, padding: 10, backgroundColor: '#FFFFFF', justifyContent: 'center' },
  heading: { fontSize: 26, fontWeight: 'bold', textAlign: 'center',alignItems:'flex-start' , marginBottom: 40, color: '#333' },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 6, color: '#555' },
  inputContainer: { backgroundColor: '#F3F3F3', padding: 16, borderRadius: 10, marginBottom: 20 },
  input: { borderColor: 'gray', borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 12, backgroundColor: '#FFF' },
  textArea: { height: 80, textAlignVertical: 'top' },
  imageContainer: { backgroundColor: '#F3F3F3', padding: 16, borderRadius: 10, marginBottom: 20 },
  imageInputBox: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  imageInputText: { color: '#555', fontSize: 16 },
  selectedImage: { width: '100%', height: 250, borderRadius: 8, marginTop: 12 },
  submitButton: {
    backgroundColor: '#8A4FFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});

export default PostItemScreen;