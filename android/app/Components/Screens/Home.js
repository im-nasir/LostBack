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
// import moment from 'moment'; // Import moment for date formatting

const Home = ({ navigation, route }) => {
  const [userName, setUserName] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState({});

  const currentUserId = route.params?.currentUserId; // Safely access currentUserId
  const user = currentUserId ? { uid: currentUserId } : auth().currentUser; // Create a user object

  const formatDate = (dateString) => {
    if (!dateString) {
      return 'Unknown';
    }
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Unknown';
    }
  };
  
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
      <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', backgroundColor:'#8A4FFF', paddingRight: 20}}>
      <View style={styles.header}>
        <Image
          style={styles.profileImage}
          source={
            profilePic ? { uri: profilePic } : require('../Theme/Images/profile.jpg')
          }
        />
        <Text style={styles.headerText}>Hi, {userName}</Text>
      </View>
      
        <TouchableOpacity>
                <View style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 10 }}>
                <Icon name="paper-plane" size={23} color="#FFF" />

                </View>
         </TouchableOpacity>
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
            <View style={{justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', marginRight: 10}}>
              <Text style={styles.postLocation}>{item.location}</Text>
              <Text style={styles.date}>{formatDate(item.date)}</Text>  
            </View>
              <View style={styles.actions}>
              <TouchableOpacity onPress={() => handleLike(item.id, item.likes || [])}>
                <View style={{justifyContent:'space-between', flexDirection: 'row', alignItems: 'center'}}>
                <Icon
                  name={item.likes?.includes(user?.uid) ? "heart" : "heart-o"}
                  size={24}
                  color={item.likes?.includes(user?.uid) ? "#8A4FFF" : "#8A4FFF"}
                />
                <Text style={styles.likeCount}>{item.likes?.length || 0}</Text>
                
                </View>
                
              </TouchableOpacity>
              <TouchableOpacity>
                <View style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 10 }}>
                   <Icon name="paper-plane" size={23} color="#8A4FFF" />
                </View>
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
    // backgroundColor: '#8A4FFF', // No background color
    // borderBottomWidth: 1,
    // borderBottomColor: 'rgba(255, 255, 255, 0.2)', // Subtle border
    // backdropFilter: 'blur(15px)', // Blur effect
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.05,
    // shadowRadius: 10,
    // elevation: 5, // For Android shadow
  },


  profileImage: {
    width: 40,
    height: 40,
    borderWidth: 2,
    borderColor: '#F9F9F9',
    borderRadius: 20,
    marginRight: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F9F9F9',
  },
  postCard: {
    backgroundColor: '#FFF',
    margin: 4,
    marginBottom: 10,
    borderRadius: 4,
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  postLocation: {
    fontSize: 14,
    color: '#000',
    marginBottom: 10,
  },
  postDescription: {
    fontSize: 14,
    fontWeight:'500',
    color: '#777',
    marginBottom: 10,
  },
  postDate: {
    fontSize: 12,
    color: '#777',
    marginBottom: 10,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 5,
  },
  likeCount: {
    fontSize: 18,
    fontWeight:'bold',
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