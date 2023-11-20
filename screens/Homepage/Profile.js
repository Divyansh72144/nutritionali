import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ref, get } from 'firebase/database';
import { FIRESTORE_DB } from '../Login/FirebaseConfig';
import { useAuth } from '../Login/AuthProvider';

export default function Profile() {
  const { user, isLoading } = useAuth(); // Destructure user and isLoading from useAuth
  const [displayedUsername, setDisplayedUsername] = useState('');

  useEffect(() => {
    const fetchAndDisplayUsername = async (uid) => {
      try {
        const userRef = ref(FIRESTORE_DB, `users/${uid}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          const userData = snapshot.val();
          const username = userData && userData.username ? userData.username : 'No username';
          setDisplayedUsername(username);
        } else {
          console.log('No user data found in the database');
          setDisplayedUsername('No user data');
        }
      } catch (error) {
        console.error('Error fetching data: ', error);
        setDisplayedUsername('Error fetching data');
      }
    };

    // Fetch and display username when user is available and not loading
    if (user && !isLoading) {
      fetchAndDisplayUsername(user.uid);
    }
  }, [user, isLoading]);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : user ? (
        <Text>Your username: {displayedUsername}</Text>
      ) : (
        <Text>You are not logged in</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
