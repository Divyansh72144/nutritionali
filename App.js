import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthProvider, useAuth } from './screens/Login/AuthProvider';
import Login from './screens/Login/Login';
import SignUp from './screens/Login/Signup';
import Homepage from './screens/Homepage/Homepage';
import Profile from './screens/Homepage/Profile';
import ABC from './screens/abc';
import { AppProvider, useAppContext } from './AppContext';
import RegistrationForm from './screens/Homepage/RegistrationForm';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <AppProvider>
        <AuthProvider>
        
          <AppContent />
        </AuthProvider>
      </AppProvider>
    </NavigationContainer>
  );
}

function AppContent() {
  const { userUid } = useAppContext();

  return (
    <Tab.Navigator>
      {!userUid ? (
        <>
          <Tab.Screen name="Login" component={Login} />
          <Tab.Screen name="SignUp" component={SignUp} />
        </>
      ) : (
        <>
          <Tab.Screen name="Homepage" component={Homepage} />
          <Tab.Screen name="Profile" component={Profile} />
          <Tab.Screen name="abc" component={ABC} />
          <Tab.Screen name="registration" component={RegistrationForm}/>
        </>
      )}
    </Tab.Navigator>
  );
}