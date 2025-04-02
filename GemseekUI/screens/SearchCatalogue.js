import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native';
import axios from 'axios';

const API_URL = "http://127.0.0.1:8003"; 
const { width } = Dimensions.get('window'); // Get screen width

export default function SearchCatalogueScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);

  // Fetch past search results from the backend
  const searchGemstone = async () => {
    if (!searchQuery.trim()) return; // Prevent empty searches
    try {
      const response = await axios.get(`${API_URL}/rock/${searchQuery}`);
      setResults(response.data);  // Expecting [{ id, name, picture }]
      //Test
      console.log("Fetched Data: ", response.data)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <View style={{ padding: 20, flex: 1 }}>
      <TextInput
        placeholder="Search for a gemstone..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={{
          borderWidth: 1,
          padding: 10,
          marginBottom: 10,
          borderRadius: 5
        }}
      />
      <TouchableOpacity 
        onPress={searchGemstone} 
        style={{ padding: 10, backgroundColor: 'blue', borderRadius: 5 }}>
        <Text style={{ color: 'white', textAlign: 'center' }}>Search</Text>
      </TouchableOpacity>

      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Description</Text> {/* Display gemstone description */}
      </View>

      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Past Results:</Text> {/* Display Past Gemstone Results */}
      </View>

      <FlatList
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
        data={results}
        keyExtractor={(item, index) => index.toString()} // Convert index to string
        renderItem={({ item, index }) => (
          <View style={{ 
            flexDirection: "row", // Align items in a row
            alignItems: "center",
            justifyContent: "space-between",
            padding: 15,
            borderBottomWidth: 1
          }}>
            {/* Left side: ID and Name */}
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>#{index + 1}</Text>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{item.name.toUpperCase()}</Text>
            </View>

            {/* Right side: Image */}
            {item.picture ? (
              <Image 
                source={{ uri: `data:image/png;base64,${item.picture}` }} 
                style={{ width: width * 0.3, height: width * 0.3, resizeMode: "contain" }} 
              />
            ) : (
              <Text>No Image</Text>
            )}
          </View>
        )}
      />
    </View>
  );
}
