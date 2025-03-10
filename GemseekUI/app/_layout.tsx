import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Stack, Tabs } from 'expo-router';
import { Provider } from 'react-redux';
import store from '../store';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from '../navigation/AppNavigator';

SplashScreen.preventAutoHideAsync();

// export default function RootLayout() {
//   const colorScheme = useColorScheme();
//   const router = useRouter();

//   const [loaded] = useFonts({
//     SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
//   });

//   useEffect(() => {
//     if (loaded) {
//       SplashScreen.hideAsync();
//     }
//   }, [loaded]);

//   if (!loaded) {
//     return null;
//   }

//   return (
//     <Provider store={store}>
//       <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
//         <Tabs
//           screenOptions={{
//             tabBarActiveTintColor: 'blue',
//             tabBarInactiveTintColor: 'gray',
//             headerRight: () => (
//               <TouchableOpacity onPress={() => router.push('/Profile')}>
//                 <Ionicons name="person-circle-outline" size={30} color="black" style={{ marginRight: 15 }} />
//               </TouchableOpacity>
//             ),
//           }}
//         >
//           <Tabs.Screen
//             name="upload"
//             options={{
//               title: 'Upload',
//               tabBarIcon: ({ color, size }) => <Ionicons name="cloud-upload-outline" size={size} color={color} />,
//             }}
//           />
//           <Tabs.Screen
//             name="gallery"
//             options={{
//               title: 'Gallery',
//               tabBarIcon: ({ color, size }) => <Ionicons name="images-outline" size={size} color={color} />,
//             }}
//           />
//         </Tabs>
//       </ThemeProvider>
//     </Provider>
//   );
// }
// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import AppNavigator from '../navigation/AppNavigator';
// import { Provider } from 'react-redux';
// import store from '../store/index';

export default function RootLayout() {
  return (
    <Provider store={store}>
        <AppNavigator />
    </Provider>
  );
}