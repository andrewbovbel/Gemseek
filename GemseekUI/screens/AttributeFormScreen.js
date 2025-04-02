import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Button,
  StyleSheet,
  Alert,
  CheckBox,
  TouchableOpacity,
  Platform
} from 'react-native';

const Checkbox = ({ label, checked, onChange }) => (
  <TouchableOpacity onPress={onChange} style={styles.checkboxContainer}>
    <View style={[styles.checkbox, checked && styles.checkedBox]} />
    <Text style={styles.checkboxLabel}>{label}</Text>
  </TouchableOpacity>
);

export default function AttributeFormScreen() {
  const [formData, setFormData] = useState({
    hardnessMin: '',
    hardnessMax: '',
    gravityMin: '',
    gravityMax: '',
    colour: '',
    streak: '',
    lustre: [],
    transparency: [],
    cleavage: [],
    fracture: [],
  });

  const toggleOption = (field, option) => {
    setFormData(prev => {
      const updated = prev[field].includes(option)
        ? prev[field].filter(item => item !== option)
        : [...prev[field], option];
      return { ...prev, [field]: updated };
    });
  };

  const submitForm = () => {
    const payload = { ...formData };
    
    console.log('data will be submitted:', payload);
  
    const message = JSON.stringify(payload, null, 2);
    
    if (Platform.OS === 'web') {
      alert(`data to the backend: \n\n${message}`);
    } else {
      Alert.alert('data to the backend:', message);
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
            checked={formData[field].includes(option)}
            onChange={() => toggleOption(field, option)}
          />
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Hardness:</Text>
      <View style={{ flexDirection: 'row' }}>
        <TextInput
          style={styles.input}
          placeholder="min"
          value={formData.hardnessMin}
          onChangeText={val => setFormData({ ...formData, hardnessMin: val })}
        />
        <Text style={{ marginHorizontal: 5 }}>to</Text>
        <TextInput
          style={styles.input}
          placeholder="max"
          value={formData.hardnessMax}
          onChangeText={val => setFormData({ ...formData, hardnessMax: val })}
        />
      </View>

      <Text style={styles.label}>Specific Gravity:</Text>
      <View style={{ flexDirection: 'row' }}>
        <TextInput
          style={styles.input}
          placeholder="min"
          value={formData.gravityMin}
          onChangeText={val => setFormData({ ...formData, gravityMin: val })}
        />
        <Text style={{ marginHorizontal: 5 }}>to</Text>
        <TextInput
          style={styles.input}
          placeholder="max"
          value={formData.gravityMax}
          onChangeText={val => setFormData({ ...formData, gravityMax: val })}
        />
      </View>

      <Text style={styles.label}>Colour:</Text>
      <TextInput
        style={styles.input}
        value={formData.colour}
        onChangeText={val => setFormData({ ...formData, colour: val })}
        placeholder="Enter colour"
      />

      <Text style={styles.label}>Streak:</Text>
      <TextInput
        style={styles.input}
        value={formData.streak}
        onChangeText={val => setFormData({ ...formData, streak: val })}
        placeholder="Enter streak"
      />

      {createCheckboxGroup("Lustre", "lustre", [
        "Adamantine", "Sub-Adamantine", "Vitreous", "Sub-Vitreous", "Resinous", "Waxy", "Greasy",
        "Silky", "Pearly", "Metallic", "Sub-Metallic", "Dull", "Earthy"
      ])}

      {createCheckboxGroup("Transparency", "transparency", ["Transparent", "Translucent", "Opaque"])}

      {createCheckboxGroup("Cleavage", "cleavage", [
        "None Observed", "Poor/Indistinct", "Imperfect/Fair", "Distinct/Good", "Very Good", "Perfect"
      ])}

      {createCheckboxGroup("Fracture", "fracture", [
        "None observed", "Irregular/Uneven", "Sub-Conchoidal", "Fibrous","Splintery","Micaceous","Hackly","Step-Like","Conchoidal"
      ])}

      <View style={{ marginVertical: 20 }}>
        <Button title="Submit" onPress={submitForm} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 100,
  },
  label: {
    fontSize: 16,
    marginTop: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  group: {
    marginTop: 20,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  checkboxGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginVertical: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#888',
    marginRight: 8,
  },
  checkedBox: {
    backgroundColor: 'blue',
  },
  checkboxLabel: {
    fontSize: 14,
  },
});
