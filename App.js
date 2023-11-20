import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import Homepage from './screens/Homepage/Homepage';
import Profile from './screens/Homepage/Profile';
// import Login from './screens/Login/Login';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Login from './screens/Login/Login';
// import RegistrationForm from './screens/Homepage/RegistrationForm';
import { AuthProvider } from './screens/Login/AuthProvider';

export default function App() {
  const Tab = createBottomTabNavigator();
  return (
    <NavigationContainer>
      <AuthProvider>
      <Tab.Navigator>
        <Tab.Screen name="Homepage" component={Homepage} />
        <Tab.Screen name="Profile" component={Profile} />
        <Tab.Screen name="Login" component={Login}/>
      </Tab.Navigator>
      </AuthProvider>
    </NavigationContainer>
  );
}
