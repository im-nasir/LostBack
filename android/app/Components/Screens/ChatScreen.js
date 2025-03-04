import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { collection, query, onSnapshot, addDoc, orderBy, serverTimestamp } from "firebase/firestore";
import { db } from "../Database/FirebaseConfig"; // Ensure Firebase is properly imported

const ChatScreen = ({ route, navigation }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true); // Loading state
  const { chatId, chatName, currentUserId } = route.params; // Get currentUserId from route params

  console.log("Initial currentUserId:", currentUserId); // Log initial user ID
  console.log("Received chatId:", chatId !== undefined ? chatId : "undefined"); // Debugging log
  console.log("Received chatName:", chatName); // Debugging log

  useEffect(() => {
    console.log("chatId:", chatId !== undefined ? chatId : "undefined");
    console.log("Received currentUserId:", currentUserId); // Log received user ID

    if (!chatId) {
      console.error("Chat ID is missing!");
      alert("Chat ID is missing! Please try again."); // User feedback for missing Chat ID
      return;
    }

    if (!currentUserId) {
      console.log("Waiting for user authentication...");
      return;
    }

    console.log("Chat ID:", chatId);
    console.log("User ID:", currentUserId);

    const chatRef = collection(db, "chats", chatId, "messages");
    const chatQuery = query(chatRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(chatQuery, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false); // Stop loading after fetching messages
    });

    return () => unsubscribe();
  }, [chatId, currentUserId]);

  const sendMessage = async () => {
    console.log("Attempting to send message with user ID:", currentUserId); // Log user ID before sending message
    if (!currentUserId) {
      console.error("Cannot send message, user not logged in!");
      return;
    }

    if (!chatId) {
      console.error("Cannot send message, chatId is undefined!");
      return;
    }

    if (newMessage.trim() === "") {
      console.warn("Cannot send an empty message."); // Add warning for empty messages
      return; // Prevent sending empty messages
    }

    try {
      const chatRef = collection(db, "chats", chatId, "messages");
      await addDoc(chatRef, {
        text: newMessage,
        senderId: currentUserId,
        createdAt: serverTimestamp(),
      });
      console.log("Message sent:", newMessage); // Log the sent message

      setNewMessage(""); // Clear input after sending
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading chat...</Text>
        <Text style={styles.errorText}>Please wait while we load your messages.</Text> // Add loading message
        <Text style={styles.errorText}>Chat ID: {chatId}</Text> // Debugging log for chatId
        <Text style={styles.errorText}>User ID: {currentUserId}</Text> // Debugging log for currentUserId
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.chatName}>{chatName}</Text>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.message, item.senderId === currentUserId ? styles.sent : styles.received]}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#f5f5f5" },
  chatName: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  message: { padding: 10, marginVertical: 5, borderRadius: 10 },
  sent: { alignSelf: "flex-end", backgroundColor: "#007AFF", color: "white" },
  received: { alignSelf: "flex-start", backgroundColor: "#E5E5EA" },
  messageText: { fontSize: 16 },
  inputContainer: { flexDirection: "row", alignItems: "center", padding: 10 },
  input: { flex: 1, borderWidth: 1, borderColor: "#ccc", padding: 8, borderRadius: 5, marginRight: 10 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});
