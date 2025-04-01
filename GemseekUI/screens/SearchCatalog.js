import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';

export default function SearchCatalogScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]); // Placeholder for past results

  // Sample past search results (replace with actual stored data)
  const pastSearches = [
    { id: '1', name: 'Amethyst', description: 'Purple quartz variant' },
    { id: '2', name: 'Ruby', description: 'Red corundum gemstone' },
    { id: '3', name: 'Sapphire', description: 'Blue corundum gemstone' }
  ];

  // Search logic
  const handleSearch = () => {
    const filteredResults = pastSearches.filter((gem) =>
      gem.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setResults(filteredResults);
  };

  return (
    <View style={{ padding: 20 }}>
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
      <TouchableOpacity onPress={handleSearch} style={{ padding: 10, backgroundColor: 'blue', borderRadius: 5 }}>
        <Text style={{ color: 'white', textAlign: 'center' }}>Search</Text>
      </TouchableOpacity>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.name}</Text>
            <Text>{item.description}</Text>
          </View>
        )}
      />
    </View>
  );
}
