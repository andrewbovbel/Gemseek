import React, { useState } from 'react';
import { View, Button, Image, Text, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useSelector } from 'react-redux'; // ✅ Get JWT Token from Redux

const API_URL = "http://127.0.0.1:8002"; // ✅ Change to your FastAPI URL

export default function UploadScreen() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [filename, setFilename] = useState(null);
  const token = useSelector((state) => state.auth.token); // ✅ Get JWT token
  const user = useSelector((state) => state.auth.user); // ✅ Get user email

  if (!user || !user.email) {
    Alert.alert("Authentication Error", "User not logged in.");
    return null;
  }

  // 📸 Open Camera
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission Denied", "Camera access is required to take photos.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setFilename(`photo_${Date.now()}.jpg`); // ✅ Generate unique filename
    }
  };

  // 📂 Select Image from Gallery
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission Denied", "Gallery access is required to select images.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setFilename(`gallery_${Date.now()}.jpg`); // ✅ Generate unique filename
    }
  };

  const uploadImage = async () => {
    if (!selectedImage || !filename) {
      Alert.alert("No Image Selected", "Please select or take an image first.");
      return;
    }
  
    const formData = new FormData();
  
    // ✅ Convert Image to BLOB (for PostgreSQL storage)
    const response = await fetch(selectedImage);
    const blob = await response.blob();
  
    // ✅ Append BLOB data instead of URI
    formData.append("file", blob, filename);
    formData.append("email", user.email); // ✅ Include email in request
  
    try {
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // ✅ Ensure JWT is included
        },
      });
  
      Alert.alert("Upload Successful", response.data.message);
    } catch (error) {
      console.error("Upload failed", error.response?.data);
      Alert.alert("Upload Failed", error.response?.data?.detail || "Something went wrong.");
    }
  };




  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload an Image</Text>
      {selectedImage && <Image source={{ uri: selectedImage }} style={styles.image} />}
      <Button title="Take a Photo 📸" onPress={takePhoto} />
      <Button title="Pick from Gallery 📂" onPress={pickImage} />
      <Button title="Upload Image 🔺" onPress={uploadImage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  image: { width: 200, height: 200, marginVertical: 10, borderRadius: 10 },
});