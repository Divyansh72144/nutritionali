// RegistrationForm.js
import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { ref, set, get } from 'firebase/database';
import { signOut, getAuth } from 'firebase/auth';
import { FIRESTORE_DB } from '../Login/FirebaseConfig'; // Update the path to your Firebase configuration
import { useNavigation } from '@react-navigation/native';

export default function RegistrationForm({ userUid,updateUserUid, onRegistrationComplete }) {
  const [username, setUsername] = useState('');
  const [displayedUsername, setDisplayedUsername] = useState('');
  const [signedOut, setSignedOut] = useState(false);
  const navigation = useNavigation(); // Get the navigation object

  useEffect(() => {
    // Fetch and display the username when the component mounts
    if (userUid) {
      fetchAndDisplayUsername(userUid);
    }
  }, [userUid]);

  const fetchAndDisplayUsername = async (userUid) => {
    try {
      // Reference to the 'users' node in the Realtime Database
      const userRef = ref(FIRESTORE_DB, `users/${userUid}`);

      // Fetch the data from the database
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        // If the data exists, set the displayed username state
        setDisplayedUsername(snapshot.val().username);
      } else {
        console.log('No username found in the database');
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
      Alert.alert('Error', 'Failed to fetch username. See console for details.');
    }
  };

  const saveUsername = async () => {
    try {
      console.log('Saving username:', username);
      console.log(userUid,"REGIS")
      // Reference to the 'users' node in the Realtime Database
      const userRef = ref(FIRESTORE_DB, `users/${userUid}`);

      // Set the username under the authenticated user's node
      await set(userRef, {
        username: username,
      });

      Alert.alert('Success', 'Username saved successfully');
      // Callback to notify the parent component that the registration is complete
      onRegistrationComplete();

      // Fetch and display the updated username
      fetchAndDisplayUsername(userUid);
    } catch (error) {
      console.error('Error setting data: ', error);
      Alert.alert('Error', 'Failed to save username. See console for details.');
    }
  };

  const handleSignOut = async () => {
    try {
      const auth = getAuth(); // Get the authentication object
      await signOut(auth); // Sign out the user
      setSignedOut(true); // Set the state to indicate that the user has been signed out
      updateUserUid(null);
      navigation.navigate('Homepage');
    } catch (error) {
      console.error('Error signing out: ', error);
      Alert.alert('Error', 'Failed to sign out. See console for details.');
    }
  };
  
  // Check if the user has been signed out
  if (signedOut) {
    
    return <Text>User has been signed out.</Text>;
    
  }

  return (
    <View style={styles.container}>
      <TextInput
        value={username}
        style={styles.input}
        placeholder="Username"
        autoCapitalize="none"
        onChangeText={(text) => setUsername(text)}
      />
      <Button title="Save Username" onPress={saveUsername} />
      <Button title="Sign Out" onPress={handleSignOut} />
      {displayedUsername ? <Text>Your username: {displayedUsername}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: '100%',
  },
});
