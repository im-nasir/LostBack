import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { db } from '../Database/FirebaseConfig';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import auth from '@react-native-firebase/auth';

const ChatListScreen = ({ navigation, route }) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = auth().currentUser;

  useEffect(() => {
    if (!user) {
      navigation.navigate('Login'); // Redirect to login if user is not authenticated
      console.error("User not authenticated, redirecting to login."); // Log error for debugging
      setLoading(false);
      return;
    }

    const chatsRef = collection(db, 'chats');
    const q = query(chatsRef, where('participants', 'array-contains', user.uid));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      if (querySnapshot.empty) {
        console.warn("No chats found for the user."); // Log warning if no chats are found
      }
      const chatsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChats(chatsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading chats...</Text> // Add loading message
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              console.log("Navigating to chat with ID:", item.id); // Debugging log
              alert(`Navigating to chat: ${item.name} with ID: ${item.id}`); // User feedback for navigation
              navigation.navigate('Chat', { chatId: item.id, chatName: item.name, otherParam: route.params.otherParam });
            }}
            style={styles.chatItem}
          >
            <Text style={styles.chatName}>{item.name}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.noChats}>No chats available.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#FFFFFF' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  chatItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  chatName: { fontSize: 18, fontWeight: 'bold' },
  noChats: { textAlign: 'center', marginTop: 20, fontSize: 16, color: '#777' },
})

export default ChatListScreen;
