import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export function PostDetailScreen({ route }) {
  const { item } = route.params;
  const [rated, setRated] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const sendReshuffle = async (value) => {
    try {
      const response = await fetch('http://172.30.20.2:8003/reshuffle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value }),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Response data:', data);
      setRated(true);
      setFeedback(value);
    } catch (error) {
      console.error('Failed to reshuffle:', error);
    }
  };

  const feedbackText = {
    [-1]: "You rated this as Bad.",
    [0]: "You rated this as Neutral.",
    [1]: "You rated this as Good.",
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: item.url }} style={styles.image} />
      <Text style={styles.title}>{item.title || "Untitled"}</Text>
      <Text style={styles.description}>{item.description || "No description available."}</Text>

      {rated ? (
        <Text style={styles.feedbackText}>{feedbackText[feedback]}</Text>
      ) : (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.bad]} onPress={() => sendReshuffle(-1)}>
            <Text style={styles.buttonText}>Bad</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.neutral]} onPress={() => sendReshuffle(0)}>
            <Text style={styles.buttonText}>Neutral</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.good]} onPress={() => sendReshuffle(1)}>
            <Text style={styles.buttonText}>Good</Text>
          </TouchableOpacity>
        </View>
      )}
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#444',
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  bad: {
    backgroundColor: '#e74c3c',
  },
  neutral: {
    backgroundColor: '#95a5a6',
  },
  good: {
    backgroundColor: '#2ecc71',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  feedbackText: {
    marginTop: 20,
    fontSize: 16,
    fontStyle: 'italic',
    color: '#555',
  },
});

export default PostDetailScreen;