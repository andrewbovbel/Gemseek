import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import UploadScreen from '../screens/UploadPicture';
import GalleryScreen from '../screens/Gallery';
import Forum from "../screens/Forum"
import SearchCatalogScreen from "../screens/SearchCatalogue";
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AttributeFormScreen from '../screens/AttributeFormScreen.js';
import PictureAndProperties from '../screens/PictureAndProperties.js';


const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const navigation = useNavigation();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      
      <Tab.Screen
  name="GemSeek"
  component={PictureAndProperties}
  options={{
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="construct-outline" size={size} color={color} />
    ),
  }}
/>
      <Tab.Screen
        name="Gallery"
        component={GalleryScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="images-outline" size={size} color={color} />,
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <Ionicons name="person-circle-outline" size={30} color="black" style={{ marginRight: 15 }} />
            </TouchableOpacity>
          ),
        }}
      />
      <Tab.Screen
        name="Search Catalogue"
        component={SearchCatalogScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="search" size={size} color={color} />,
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <Ionicons name="person-circle-outline" size={30} color="black" style={{ marginRight: 15 }} />
            </TouchableOpacity>
          ),
        }}
      />
      
    </Tab.Navigator>
  );
}