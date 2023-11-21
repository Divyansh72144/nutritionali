// Main_Login.js
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, ActivityIndicator, KeyboardAvoidingView, TouchableOpacity, Text ,Image} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import { FIREBASE_AUTH } from "./FirebaseConfig";
import { NavigationProp, useNavigation } from '@react-navigation/native';
import RegistrationForm from '../Homepage/RegistrationForm';
import {FIRESTORE_DB} from "./FirebaseConfig"
import Homepage from '../Homepage/Homepage';
import SignUp from './Signup';

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
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);
      setUserUid(response.user.uid);
  
      const userRef = ref(FIRESTORE_DB, `users/${response.user.uid}`);
      const snapshot = await get(userRef);
  
      if (snapshot.exists()) {
        const username = snapshot.val().username;
        // Do something with the username
      } else {
        console.log('Username not found');
        alert('Please create username');
      }
    } catch (signInError) {
      if (signInError.code === 'auth/user-not-found') {
        try {
          const createUserResponse = await createUserWithEmailAndPassword(auth, email, password);
          console.log(createUserResponse);
          const userUid = createUserResponse.user.uid;
  
          const userRef = ref(FIRESTORE_DB, `users/${userUid}`);
          await set(userRef, {
            username: 'DEFAULT_USERNAME',
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
          <RegistrationForm
            userUid={userUid}
            updateUserUid={updateUserUid}
            onRegistrationComplete={handleRegistrationComplete}
          />
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
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <TouchableOpacity style={styles.customButton} onPress={signIn}>
              
              <Text style={styles.buttonText}>Login
              <Image
                source={require('../../media/gifs/icon.svg')} // Replace with the actual path to your GIF
                style={styles.gif}
              /></Text>
            </TouchableOpacity>
          )}
             <TouchableOpacity
                style={styles.customButton}
                onPress={() => navigation.navigate('SignUp')}
              >
                <Text style={styles.buttonText}>Sign Up</Text>
              </TouchableOpacity>
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
  customButton: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  gif: {
    width: 20, // Adjust the width as needed
    height: 20,
    marginLeft:3, // Adjust the height as needed
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default Main_Login;
