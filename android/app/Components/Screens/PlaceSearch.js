import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const PlaceSearch = ({ onSelectPlace }) => {
  const [query, setQuery] = useState('');
  const [places, setPlaces] = useState([]);

  const fetchPlaces = async (text) => {
    setQuery(text);

    if (text.length < 3) {
      setPlaces([]);
      return;
    }

    const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoibHVjaXRob3I1NSIsImEiOiJjbTd1cDBvdnowMnh3Mmxvazc3b2VoZ2FwIn0.nmUWt6oaq3y7qjeXgmVWGQ';
    const bbox = '60.87,23.63,77.01,37.07'; // Bounding box for Pakistan (Southwest, Northeast)

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${text}.json?bbox=${bbox}&country=PK&access_token=${MAPBOX_ACCESS_TOKEN}`
      );
      const data = await response.json();
      setPlaces(data.features);
    } catch (error) {
      console.error('Error fetching places:', error);
    }
  };

  const handlePlaceSelect = (place) => {
    setQuery(place.place_name);
    setPlaces([]);

    if (typeof onSelectPlace === 'function') {
      onSelectPlace(place.place_name);
    } else {
      console.error('Error: onSelectPlace is not a function.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={query}
        onChangeText={fetchPlaces}
        placeholder="Enter location"
        placeholderTextColor="#888"
      />
      {places.length > 0 && (
        <FlatList
          data={places}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.placeItem} onPress={() => handlePlaceSelect(item)}>
              <Text>{item.place_name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  input: {
    borderColor: '#BDC3C7',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#F9F9F9',
    color: '#2C3E50',
  },
  placeItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    backgroundColor: '#FFF',
  },
});

export default PlaceSearch;
