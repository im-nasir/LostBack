import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet, Alert, Modal, TextInput, Image, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const MyPostScreen = ({ navigation }) => {
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState('');
  const [updatedDescription, setUpdatedDescription] = useState('');

  useEffect(() => {
    // Get the current user's ID
    const user = auth().currentUser;
    if (user) {
      setUserId(user.uid);
    }

    // Fetch the user's posts from Firestore
    const unsubscribe = firestore()
      .collection('posts')
      .where('userId', '==', userId)
      .onSnapshot(
        (querySnapshot) => {
          const postsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setUserPosts(postsData);
          setLoading(false);
        },
        (error) => {
          console.error('Error fetching posts: ', error);
          setLoading(false);
        }
      );

    return unsubscribe;
  }, [userId]);

  const handleDelete = (postId) => {
    Alert.alert('Delete Post', 'Are you sure you want to delete this post?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: () => {
          firestore()
            .collection('posts')
            .doc(postId)
            .delete()
            .then(() => {
              console.log('Post deleted!');
            })
            .catch((error) => {
              console.error('Error deleting post: ', error);
            });
        },
      },
    ]);
  };

  const handleEdit = () => {
    if (selectedPost) {
      firestore()
        .collection('posts')
        .doc(selectedPost.id)
        .update({
          title: updatedTitle,
          description: updatedDescription,
        })
        .then(() => {
          console.log('Post updated!');
          setIsModalVisible(false); // Close modal after update
        })
        .catch((error) => {
          console.error('Error updating post: ', error);
        });
    }
  };

  const handleOpenModal = (post) => {
    setSelectedPost(post);
    setUpdatedTitle(post.title);
    setUpdatedDescription(post.description);
    setIsModalVisible(true);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8A4FFF" />
        <Text style={styles.loadingText}>Loading posts...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>MY POSTS</Text>
      {userPosts.length === 0 ? (
        <Text style={styles.noPostsText}>You have not posted anything yet.</Text>
      ) : (
        <FlatList
          data={userPosts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.postCard}>
              {/* Render Images */}
              {item.imageUrls && item.imageUrls.length > 0 ? (
                <FlatList
                  horizontal
                  data={item.imageUrls}
                  renderItem={({ item: imageUri }) => (
                    <Image
                      key={imageUri}
                      style={styles.postImage}
                      source={{ uri: imageUri || 'https://via.placeholder.com/150' }}
                    />
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />
              ) : (
                <Image
                  style={styles.postImage}
                  source={{ uri: item.image || 'https://via.placeholder.com/150' }}
                />
              )}
              <Text style={styles.postTitle}>{item.title}</Text>
              <Text style={styles.postLocation}>{item.location}</Text>
              <View style={styles.postActions}>
                <TouchableOpacity onPress={() => handleOpenModal(item)} style={styles.editButton}>
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {/* Modal for editing post */}
      <Modal
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Post</Text>
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={updatedTitle}
              onChangeText={setUpdatedTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={updatedDescription}
              onChangeText={setUpdatedDescription}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={handleEdit} style={styles.saveButton}>
                <Text style={styles.buttonText}>Save Changes</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.cancelButton}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 8, alignItems: 'center', backgroundColor: '#F7F7F7' },
  heading: { fontSize: 28,
    width:'90%',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#8E44AD',
    letterSpacing: 1,
    marginTop: 16,
    marginBottom: 16,
    
    textShadowRadius: 3,
    backgroundColor: '#EDE7F6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden', },

  noPostsText: { fontSize: 16, color: '#555' },
  postCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
    width: '100%',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  postTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  postLocation: { fontSize: 16, color: '#777' },
  postActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 15 },
  editButton: { backgroundColor: '#8A4FFF', padding: 10, marginRight: 10, borderRadius: 8 },
  deleteButton: { backgroundColor: '#FF6347', padding: 10, borderRadius: 8 },
  buttonText: { color: '#F7F7F7', fontWeight: 'bold' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#555' },

  // Modal Styles
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  saveButton: { backgroundColor: '#8A4FFF', padding: 10, borderRadius: 8, flex: 1, marginRight: 5 },
  cancelButton: { backgroundColor: '#FF6347', padding: 10, borderRadius: 8, flex: 1, marginLeft: 5 },
  postImage: {
    width: '100%',
    height: 150,
    marginBottom: 10,
    borderRadius: 8,
  },
});

export default MyPostScreen;