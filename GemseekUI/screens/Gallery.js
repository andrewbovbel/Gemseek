import React, { useEffect, useState } from 'react';
import { View, FlatList, Image, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native';


const API_URL = "http://172.20.10.2:8002"; // ✅ Use LAN IP if needed

export default function GalleryScreen() {
  const navigation = useNavigation();
  const [photoData, setPhotoData] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!user || !user.email) {
      Alert.alert("Authentication Error", "User not logged in.");
      return;
    }

    const fetchPhotoData = async () => {
      try {
        const response = await axios.get(`${API_URL}/gemstone-photos/${user.email}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.photos && response.data.photos.length > 0) {
          setPhotoData(response.data.photos);
        } else {
          Alert.alert("No Images Found", "You haven't uploaded any images yet.");
        }
      } catch (error) {
        console.error("Failed to fetch photo data", error.response?.data || error.message);
        Alert.alert("Error", "Could not fetch image list.");
      } finally {
        setLoading(false);
      }
    };

    fetchPhotoData();
  }, []);

  const renderItem = ({ item }) => {
    const isComplete = item.title && item.description;
    const title = item.title || "";
    const description = item.description || "";
  
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("PostDetail", { item })}
      >
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={[styles.statusDot, { backgroundColor: isComplete ? 'green' : 'red' }]} />
          <Text style={styles.headerText}>{title}</Text>
          {!isComplete && <ActivityIndicator size="small" color="#999" style={styles.spinner} />}
        </View>
        <Image source={{ uri: item.url }} style={styles.image} />
        <Text style={styles.description}>{description}</Text>
      </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Uploaded Gemstones</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : photoData.length === 0 ? (
        <Text>No images uploaded yet.</Text>
      ) : (
        <FlatList
  key={'reddit-style'} // 👈 force a re-render
  data={photoData}
  keyExtractor={(item, index) => item.id?.toString() || index.toString()}
  renderItem={renderItem}
  contentContainerStyle={{ paddingBottom: 20 }}
/>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    marginTop: 6,
    color: '#555',
    fontStyle: 'italic',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  spinner: {
    marginLeft: 8,
  },
});