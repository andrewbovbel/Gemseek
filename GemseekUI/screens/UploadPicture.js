import React, { useState } from 'react';
import { View, Button, Image, Text, StyleSheet, Alert, ActivityIndicator, TouchableWithoutFeedback } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useSelector } from 'react-redux';

const UPLOAD_API = "http://127.0.0.1:8002/upload-gemstone";
const ML_API = "http://localhost:8003/upload";
const PUT_METADATA_API = "http://127.0.0.1:8002/gemstone-photo";


export default function UploadScreen() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [filename, setFilename] = useState(null);
  const [uploading, setUploading] = useState(false); // 🔒 UI lock state
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);

  const takePhoto = async () => {
    if (uploading) return;
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
    if (uploading) return;
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

    setUploading(true); // 🔐 Start UI lock

    try {
      const blob = await (await fetch(selectedImage)).blob();

      const formData = new FormData();
      formData.append("file", blob, filename);

      const uploadResponse = await axios.post(UPLOAD_API, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      const { photo_id } = uploadResponse.data;
      const base64Image = await blobToBase64(blob);

      const mlResponse = await axios.post(ML_API, {
        image: base64Image,
        properties: { cleavagetype: ["Poor/Indistinct"] },
      });

      const { gem_name, gem_history } = mlResponse.data;

      await axios.put(`${PUT_METADATA_API}/${photo_id}`, {
        title: gem_name,
        description: gem_history,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Alert.alert("Upload Complete", `Identified as: ${gem_name}`);
    } catch (error) {
      console.error("Upload flow failed", error.response?.data || error.message);
      Alert.alert("Upload Failed", error.response?.data?.detail || "Something went wrong.");
    } finally {
      setUploading(false); // 🔓 Re-enable UI
    }
  };

  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        const base64data = reader.result.split(',')[1];
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

      {uploading && (
        <TouchableWithoutFeedback>
          <View style={styles.overlay}>
            <ActivityIndicator size="large" color="#ffffff" />
            <Text style={styles.uploadingText}>Uploading & Classifying...</Text>
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  image: { width: 200, height: 200, marginVertical: 10, borderRadius: 10 },
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  uploadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500',
  },
});