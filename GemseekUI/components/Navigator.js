import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import SignInScreen from '../screens/Signin';
import SignUpScreen from '../screens/Signup';
import ProfileScreen from "../screens/Profile"

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (

      <Stack.Navigator initialRouteName="SignIn">
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} /> {/* ✅ Add Profile Screen */}
      </Stack.Navigator>

  );
};

export default AppNavigator;