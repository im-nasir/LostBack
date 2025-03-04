import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome';

const Home = ({ navigation, route }) => {
  const [userName, setUserName] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState({});

  const currentUserId = route.params?.currentUserId; // Safely access currentUserId
  const user = currentUserId ? { uid: currentUserId } : auth().currentUser; // Create a user object

  useEffect(() => {
    const fetchUserData = () => {
      if (user && user.uid) { // Check if user and user.uid exist
        firestore()
          .collection('users')
          .doc(user.uid)
          .onSnapshot((doc) => {
            if (doc.exists) {
              const userData = doc.data();
              setUserName(userData.displayName || 'Guest');
              setProfilePic(userData.profilePic);
            }
          });
      }
    };

    fetchUserData();

    const unsubscribe = firestore()
      .collection('posts')
      .orderBy('date', 'desc')
      .onSnapshot((querySnapshot) => {
        const postsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(postsData);
        setLoading(false);
      });

    return () => unsubscribe();
  }, [user]);

  const handleLike = async (postId, likes) => {
    if (user && user.uid) { // Check if user and user.uid exist
      const isLiked = likes.includes(user.uid);
      const updatedLikes = isLiked
        ? likes.filter((id) => id !== user.uid)
        : [...likes, user.uid];

      try {
        await firestore().collection('posts').doc(postId).update({
          likes: updatedLikes,
        });
      } catch (error) {
        console.error('Error updating likes:', error);
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          style={styles.profileImage}
          source={
            profilePic ? { uri: profilePic } : require('../Theme/Images/profile.jpg')
          }
        />
        <Text style={styles.headerText}>Hi, {userName}</Text>
      </View>

      {/* Posts */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.postCard}>
            <View style={styles.postHeader}>
              <Image
                source={{ uri: item.userProfileImage || 'https://via.placeholder.com/150' }}
                style={styles.userProfileImage}
              />
              <Text style={styles.userName}>{item.userName || 'Anonymous'}</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('ItemDetails', { item })}>
              <Image source={{ uri: item.image }} style={styles.postImage} />
            </TouchableOpacity>
            <Text style={styles.postTitle}>{item.title}</Text>
            <Text style={styles.postDescription}>{item.description}</Text>
            <Text style={styles.postLocation}>{item.location}</Text>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => handleLike(item.id, item.likes || [])}>
                <Icon
                  name={item.likes?.includes(user?.uid) ? "heart" : "heart-o"}
                  size={24}
                  color={item.likes?.includes(user?.uid) ? "#007AFF" : "gray"}
                />
                <Text style={styles.likeCount}>{item.likes?.length || 0}</Text>
              </TouchableOpacity>

            </View>
            <TouchableOpacity onPress={() => navigation.navigate('ChatList')}>
              <Text style={styles.chatButton}>Go to Chats</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.noPosts}>No posts available.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  postCard: {
    backgroundColor: '#FFF',
    margin: 10,
    borderRadius: 10,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  postLocation: {
    fontSize: 14,
    color: '#777',
    marginBottom: 10,
  },
  postDescription: {
    fontSize: 14,
    fontWeight:'semibold',
    color: '#777',
    marginBottom: 10,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeCount: {
    fontSize: 16,
    marginLeft: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPosts: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#777',
  },
});

export default Home;