import React from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from '../store/authSlice';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(signOut());
    navigation.replace('Signin'); // Redirect to SignIn screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      {user ? (
        <>
          {/* ✅ Display Profile Image */}
          <Image 
            source={{ uri: user.profileImage || 'https://via.placeholder.com/100' }} 
            style={styles.profileImage}
          />
          <Text style={styles.info}>Name: {user.name}</Text>
          <Text style={styles.info}>Email: {user.email}</Text>

          {/* ✅ Button to go Home */}
          <Button title="Go to Home" onPress={() => navigation.navigate('MainTabs', { screen: 'Upload' })} />

          {/* ✅ Logout Button */}
          <Button title="Logout" onPress={handleLogout} />
        </>
      ) : (
        <>
          <Text style={styles.info}>Not logged in</Text>
          
          {/* ✅ Show Sign In and Sign Up buttons */}
          <Button title="Sign In" onPress={() => navigation.replace('Signin')} />
          <Button title="Sign Up" onPress={() => navigation.replace('Signup')} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  profileImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 20 },
  info: { fontSize: 18, marginBottom: 10 },
});

export default ProfileScreen;