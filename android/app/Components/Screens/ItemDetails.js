import React from 'react';
import { View, Text, Image, Button, StyleSheet, ScrollView } from 'react-native';

const ItemDetailsScreen = ({ route, navigation }) => {
  const { item } = route.params; // Get the item object passed from navigation

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Item Images */}
      {item.images && item.images.length > 0 ? (
        item.images.map((imageUri, index) => (
          <Image
            key={index}
            style={styles.image}
            source={{ uri: imageUri || 'https://via.placeholder.com/150' }}
          />
        ))
      ) : (
        <Image
          style={styles.image}
          source={{ uri: item.image || 'https://via.placeholder.com/150' }}
        />
      )}

      {/* Item Details */}
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.date}>Date Lost: {item.date || 'Unknown'}</Text>
      <Text style={styles.location}>Location: {item.location || 'Unknown'}</Text>
      <Text style={styles.description}>
        {item.description || 'No description provided.'}
      </Text>

      {/* Contact Button */}
      <Button
        title="Contact Poster"
        onPress={() => alert(`Contacting ${item.userName || 'Anonymous'}`)}
      />
      {/* Add this button in the ItemDetails screen to start a chat with the poster */}
      <Button
        title="Contact Poster"
        onPress={() => navigation.navigate('Chat', { chatId: item.id, chatName: item.userName })}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, alignItems: 'center' },
  image: { width: '100%', height: 200, borderRadius: 10, marginBottom: 10 },
  title: { fontSize: 24, fontWeight: 'bold', marginVertical: 10, textAlign: 'center' },
  date: { fontSize: 16, color: 'gray', marginBottom: 5 },
  location: { fontSize: 16, color: 'gray', marginBottom: 10 },
  description: { fontSize: 16, marginVertical: 10, textAlign: 'center' },
});

export default ItemDetailsScreen;
