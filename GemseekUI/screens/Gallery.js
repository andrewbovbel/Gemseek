import React, { useEffect, useState } from 'react';
import { View, FlatList, Image, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';

const API_URL = "http://127.0.0.1:8002"; // ✅ Update FastAPI URL

export default function GalleryScreen() {
  const [images, setImages] = useState([]); // ✅ Stores list of image filenames
  const [imageBlobs, setImageBlobs] = useState({}); // ✅ Stores image BLOBs
  const [loading, setLoading] = useState(true);
  
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!user || !user.email) {
      Alert.alert("Authentication Error", "User not logged in.");
      return;
    }

    const fetchImages = async () => {
      try {
        console.log("Fetching images with token:", token);
        const response = await axios.get(`${API_URL}/images`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.images) {
          setImages(response.data.images);
        } else {
          Alert.alert("No Images Found", "You haven't uploaded any images yet.");
        }
      } catch (error) {
        console.error("Failed to fetch images", error.response?.data);
        Alert.alert("Error", "Could not fetch images.");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  // ✅ Fetch BLOBs for each image filename
  useEffect(() => {
    const fetchImageBlobs = async () => {
      const updatedBlobs = {};

      for (let img of images) {
        try {
          const response = await axios.get(`${API_URL}/image/${img.filename}`, {
            headers: { Authorization: `Bearer ${token}` },
            responseType: "blob", // ✅ Get response as a BLOB
          });

          // ✅ Convert Blob to a local object URL
          const imageUrl = URL.createObjectURL(response.data);
          updatedBlobs[img.filename] = imageUrl;
        } catch (error) {
          console.error(`Failed to load image ${img.filename}`, error);
        }
      }

      setImageBlobs(updatedBlobs);
    };

    if (images.length > 0) {
      fetchImageBlobs();
    }
  }, [images]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Uploaded Images</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : images.length === 0 ? (
        <Text>No images uploaded yet.</Text>
      ) : (
        <FlatList
          data={images}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            imageBlobs[item.filename] ? (
              <Image source={{ uri: imageBlobs[item.filename] }} style={styles.image} />
            ) : (
              <Text>Loading {item.filename}...</Text>
            )
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  image: { width: 150, height: 150, margin: 5, borderRadius: 10 },
});