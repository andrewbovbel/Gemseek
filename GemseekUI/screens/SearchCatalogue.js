import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native';
import axios from 'axios';

const API_URL = "http://172.20.10.2:8003"; 
const { width } = Dimensions.get('window'); // Get screen width

export default function SearchCatalogueScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [description, setDescription] = useState('');

  // Fetch past search results from the backend
  const searchGemstone = async () => {
    if (!searchQuery.trim()) return; // Prevent empty searches
    try {
      const response = await axios.get(`${API_URL}/rock/${searchQuery}`);
      setResults(response.data.results);  // Expecting [{ id, name, picture }]
      setDescription(response.data.description);  // Expecting [{ id, name, picture }]
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
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Description: {description}</Text> {/* Display gemstone description */}
      </View>

      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Past Results:</Text> {/* Display Past Gemstone Results */}
      </View>

      <View style={{ 
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc'
      }}>
        {/* ID Column */} 
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>ID</Text> 
        </View>

        {/* Divider */}
        <View style={{ width: 1, height: '100%', backgroundColor: '#ccc' }} />

        {/* Name Column */}
        <View style={{ flex: 2, alignItems: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Name</Text> 
        </View>

        {/* Divider */}
        <View style={{ width: 1, height: '100%', backgroundColor: '#ccc' }} />

        {/* Image Column */}
        <View style={{ flex: 3, alignItems: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Image</Text>
        </View>
      </View>

      <FlatList
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
        data={results}
        keyExtractor={(item, index) => index.toString()} // Convert index to string
        renderItem={({ item, index }) => (
          <View style={{ 
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 15,
            borderBottomWidth: 1,
            borderBottomColor: '#eee'
          }}>
            {/* ID */}
            <View style={{ flex: 1 , alignItems: 'center' }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>#{index + 1}</Text>
            </View>
          
            {/* Divider */}
            <View style={{ width: 1, height: '100%', backgroundColor: '#ddd' }} />
          
            {/* Name */}
            <View style={{ flex: 2, alignItems: 'center' }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }} numberOfLines={1}>
                {item.name.toUpperCase()}
              </Text>
            </View>
          
            {/* Divider */}
            <View style={{ width: 1, height: '100%', backgroundColor: '#ddd' }} />
          
            {/* Image */}
            <View style={{ flex: 3, alignItems: 'center' }}>
              {item.picture ? (
                <Image 
                  source={{ uri: `data:image/png;base64,${item.picture}` }} 
                  style={{ width: width * 0.25, height: width * 0.25, resizeMode: "contain" }} 
                />
              ) : (
                <Text>No Image</Text>
              )}
            </View>
          </View>          
        )}
      />
    </View>
  );
}
