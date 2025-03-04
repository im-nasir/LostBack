import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { useRoute } from '@react-navigation/native';

const DebugChat = () => {
  const route = useRoute();
  const { chatId, chatName } = route.params || { chatId: undefined, chatName: null };

  useEffect(() => {
    console.log("Debugging Chat Screen Params:");
    console.log("Chat ID:", chatId);
    console.log("Chat Name:", chatName);
    console.log("Debugging Chat Screen Params:");
    console.log("Chat ID:", chatId);
    console.log("Chat Name:", chatName);
  }, [chatId, chatName]);

  return (
    <View>
      <Text>Debugging Chat Screen</Text>
      <Text>Chat ID: {chatId}</Text>
      <Text>Chat Name: {chatName}</Text>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

export default DebugChat;
