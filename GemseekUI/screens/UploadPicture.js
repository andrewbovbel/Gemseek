import React, { useState } from 'react';
import { View, Button, Image, Text, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useSelector } from 'react-redux';

const UPLOAD_API = "http://127.0.0.1:8002/upload-gemstone"; // your FastAPI endpoint
const ML_API = "http://localhost:8003/upload"; // your classification endpoint
const PUT_METADATA_API = "http://127.0.0.1:8002/gemstone-photo"; // for metadata update

export default function UploadScreen() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [filename, setFilename] = useState(null);
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);

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
      setFilename(`photo_${Date.now()}.jpg`);
    }
  };

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
      setFilename(`gallery_${Date.now()}.jpg`);
    }
  };

  const uploadImage = async () => {
    if (!selectedImage || !filename) {
      Alert.alert("No Image Selected", "Please select or take an image first.");
      return;
    }

    try {
      const blob = await (await fetch(selectedImage)).blob();

      // Step 1: Upload to FastAPI
      const formData = new FormData();
      formData.append("file", blob, filename);
      const uploadResponse = await axios.post(UPLOAD_API, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      const { photo_id } = uploadResponse.data;

      // Step 2: Convert blob to base64
      const base64Image = await blobToBase64(blob);

      // Step 3: POST to ML API
      const mlResponse = await axios.post(ML_API, {
        image: base64Image,
        properties: { cleavagetype: ["Poor/Indistinct"] }
      });

      const { gem_name, gem_history } = mlResponse.data;

      console.log("||", gem_name, gem_history)

      // Step 4: PUT metadata back to FastAPI
      await axios.put(`${PUT_METADATA_API}/${photo_id}`, {
        title: gem_name,
        description: gem_history
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      Alert.alert("Upload Complete", `Identified as: ${gem_name}`);
    } catch (error) {
      console.error("Upload flow failed", error.response?.data || error.message);
      Alert.alert("Upload Failed", error.response?.data?.detail || "Something went wrong.");
    }
  };

  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        const base64data = reader.result.split(',')[1]; // Remove data:image/...;base64,
        resolve(base64data);
      };
      reader.readAsDataURL(blob);
    });
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