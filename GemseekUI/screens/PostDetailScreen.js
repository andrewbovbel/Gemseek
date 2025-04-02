import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

export function PostDetailScreen({ route }) {
  const { item } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: item.url }} style={styles.image} />
      <Text style={styles.title}>{item.title || "Untitled"}</Text>
      <Text style={styles.description}>{item.description || "No description available."}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
    textAlign: 'center',
  },
});

export default PostDetailScreen;