import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './TabNavigator';
import ProfileScreen from '../screens/Profile';
import SigninScreen from '../screens/Signin';
import SignupScreen from '../screens/Signup';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import {PostDetailScreen} from "../screens/PostDetailScreen"

const Stack = createStackNavigator();

export default function AppNavigator() {
  // const user = true;
  const user = useSelector((state) => state.auth.user); // ✅ Get user from Redux
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ Simulate a slight delay to ensure Redux state is ready
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 100); // Adjust time if needed

    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (

      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* ✅ If user exists, show MainTabs (Upload & Gallery) */}
        {user ? (
          <>
            <Stack.Screen name="MainTabs" component={TabNavigator} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="PostDetail" component={PostDetailScreen} options={{ headerShown: true, title: '' }} />
            
          </>
        ) : (
          // ✅ If NO user, show Signin first
          <Stack.Screen name="Signin" component={SigninScreen} />
        )}

        {/* ✅ Signup is always accessible */}
        <Stack.Screen name="Signup" component={SignupScreen} />
      </Stack.Navigator>

  );
}