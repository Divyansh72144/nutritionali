// Main_Login.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, ActivityIndicator, KeyboardAvoidingView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { ref, set, get } from 'firebase/database'; // Import these functions from Firebase
import { FIREBASE_AUTH } from "./FirebaseConfig";
import { NavigationProp, useNavigation } from '@react-navigation/native';
import RegistrationForm from '../Homepage/RegistrationForm';
import {FIRESTORE_DB} from "./FirebaseConfig"
import Homepage from '../Homepage/Homepage';

interface MainLoginProps {
  navigation: NavigationProp<any>;
}

const Main_Login = ({ navigation }: MainLoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [userUid, setUserUid] = useState(null);
  const auth = FIREBASE_AUTH;
  const signIn = async () => {
    setLoading(true);
    try {
      // Try to sign in the user
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);
      setUserUid(response.user.uid);
  
      // Fetch the username from the database
      const userRef = ref(FIRESTORE_DB, `users/${response.user.uid}`);
      const snapshot = await get(userRef);
  
      if (snapshot.exists()) {
        // If the user exists, set the username or handle it as needed
        const username = snapshot.val().username;
        // Do something with the username, you can set it in the state or use it as needed
      } else {
        // If the user doesn't exist, you might want to handle this case accordingly
        console.log('User not found in the database');
        alert('User not found. Please register.');
      }
    } catch (signInError) {
      if (signInError.code === 'auth/user-not-found') {
        // If the user doesn't exist, proceed with creating the user
        try {
          const createUserResponse = await createUserWithEmailAndPassword(auth, email, password);
          console.log(createUserResponse);
          const userUid = createUserResponse.user.uid;
  
          // Set the username under the authenticated user's node
          const userRef = ref(FIRESTORE_DB, `users/${userUid}`);
          await set(userRef, {
            username: 'DEFAULT_USERNAME', // You might want to set a default username or handle this differently
          });
  
          setUserUid(userUid);
        } catch (createUserError) {
          console.error(createUserError);
          alert('Create user failed ' + createUserError.message);
        }
      } else {
        console.error(signInError);
        alert('Sign in failed ' + signInError.message);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const updateUserUid = (newUserUid) => {
    setUserUid(newUserUid);
  };

  const handleRegistrationComplete = () => {
    navigation.navigate('Homepage');
  };

  return (
    <View style={styles.container}>
  {userUid ? (
    <>
      <Homepage userUid={userUid} updateUserUid={updateUserUid}/>
      <RegistrationForm userUid={userUid} updateUserUid={updateUserUid} onRegistrationComplete={handleRegistrationComplete} />
    </>
  ) : (
    <KeyboardAvoidingView behavior="padding">
      <TextInput
        value={email}
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        secureTextEntry={true}
        value={password}
        style={styles.input}
        placeholder="Password"
        autoCapitalize="none"
        onChangeText={(text) => setPassword(text)}
      />
      {loading ? (<ActivityIndicator size="large" color="#0000ff" />) : (
        <Button title="Login" onPress={signIn} />
      )}
    </KeyboardAvoidingView>
  )}

  <StatusBar style="auto" />
</View>

  );
};

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

export default Main_Login;
