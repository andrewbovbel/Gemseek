import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function PostDetailScreen({ route }) {
  const { post } = route.params;

  return (
    <View style={styles.container}>
      <Image source={{ uri: post.imageUrl }} style={styles.image} />
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.desc}>{post.description}</Text>
      <Text style={styles.poster}>Posted by: {post.email || "Anonymous"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center' },
  image: { width: '100%', height: 300, borderRadius: 12, marginBottom: 20 },
  title: { fontSize: 22, fontWeight: 'bold' },
  desc: { fontSize: 16, color: '#666', marginVertical: 10 },
  poster: { fontSize: 14, fontStyle: 'italic', color: '#888' },
});