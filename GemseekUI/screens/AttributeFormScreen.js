import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  ScrollView,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
  Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const Checkbox = ({ label, checked, onChange }) => (
  <TouchableOpacity onPress={onChange} style={styles.checkboxContainer}>
    <View style={[styles.checkbox, checked && styles.checkedBox]} />
    <Text style={styles.checkboxLabel}>{label}</Text>
  </TouchableOpacity>
);

export default function UploadAndAttributeScreen() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [filename, setFilename] = useState(null);

  const [formData, setFormData] = useState({
    colour: [],
    lustretype: [],
    diapheny: [],
    cleavagetype: [],
    fracturetype: [],
  });

  const toggleOption = (field, option) => {
    setFormData(prev => {
      const updated = prev[field].includes(option)
        ? prev[field].filter(item => item !== option)
        : [...prev[field], option];
      return { ...prev, [field]: updated };
    });
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission denied", "We need access to your gallery.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setFilename(`upload_${Date.now()}.jpg`);
    }
  };

  const createCheckboxGroup = (title, field, options) => (
    <View style={styles.group}>
      <Text style={styles.groupTitle}>{title}:</Text>
      <View style={styles.checkboxGroup}>
        {options.map(option => (
          <Checkbox
            key={option}
            label={option}
            checked={(formData[field] || []).includes(option)}
            onChange={() => toggleOption(field, option)}
          />
        ))}
      </View>
    </View>
  );

  const submitAll = async () => {
    if (!selectedImage) {
      Alert.alert("Image missing", "Please select an image.");
      return;
    }

    const base64Image = await convertToBase64(selectedImage);

    const payload = {
      image: base64Image,
      properties: formData,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (Platform.OS === "web") {
        alert(`✅ Backend result:\n${JSON.stringify(data, null, 2)}`);
      } else {
        Alert.alert("Result", JSON.stringify(data, null, 2));
      }
    } catch (error) {
      console.error("❌ Submit failed", error);
      Alert.alert("Error", "Failed to send to backend.");
    }
  };

  const convertToBase64 = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        if (!result.startsWith("data:image")) {
          // Fallback: add prefix manually if missing
          resolve(`data:image/jpeg;base64,${result.split(",")[1]}`);
        } else {
          resolve(result); // already includes prefix
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>1. Upload Image</Text>
      {selectedImage && (
        <Image source={{ uri: selectedImage }} style={styles.image} />
      )}
      <Button title="Pick an Image 📂" onPress={pickImage} />

      <Text style={styles.title}>2. Select Attributes</Text>
      {createCheckboxGroup("Colour", "colour", [
        "White", "Black", "Gray", "Brown", "Red", "Orange", "Yellow", "Green", "Blue", "Purple"
      ])}
      {createCheckboxGroup("Lustre", "lustretype", [
        "Adamantine", "Sub-Adamantine", "Vitreous", "Sub-Vitreous", "Resinous", "Waxy", "Greasy",
        "Silky", "Pearly", "Metallic", "Sub-Metallic", "Dull", "Earthy"
      ])}
      {createCheckboxGroup("Transparency", "diapheny", ["Transparent", "Translucent", "Opaque"])}
      {createCheckboxGroup("Cleavage", "cleavagetype", [
        "None Observed", "Poor/Indistinct", "Imperfect/Fair", "Distinct/Good", "Very Good", "Perfect"
      ])}
      {createCheckboxGroup("Fracture", "fracturetype", [
        "None observed", "Irregular/Uneven", "Sub-Conchoidal", "Fibrous",
        "Splintery", "Micaceous", "Hackly", "Step-Like", "Conchoidal"
      ])}

      <View style={{ marginVertical: 30 }}>
        <Button title="Submit All 📨" onPress={submitAll} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 100 },
  title: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  image: { width: '100%', height: 200, borderRadius: 10, marginBottom: 15 },
  group: { marginTop: 10 },
  groupTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  checkboxGroup: { flexDirection: 'row', flexWrap: 'wrap' },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', width: '50%', marginVertical: 4 },
  checkbox: { width: 20, height: 20, borderWidth: 1, borderColor: '#888', marginRight: 8 },
  checkedBox: { backgroundColor: 'blue' },
  checkboxLabel: { fontSize: 14 },
});
