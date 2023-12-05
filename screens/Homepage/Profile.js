import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { ref, get, remove } from 'firebase/database';
import { deleteUser, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { FIRESTORE_DB, FIREBASE_AUTH } from '../Login/FirebaseConfig';
import { useAuth } from '../Login/AuthProvider';
import { useAppContext } from '../../AppContext';
import { useNavigation } from '@react-navigation/native';

// Import the RegistrationForm component
import RegistrationForm from './RegistrationForm';

export default function Profile() {
  const { user, isLoading } = useAuth();
  const { userUid, username } = useAppContext();

  const [displayedUsername, setDisplayedUsername] = useState('');
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  useEffect(() => {
    const fetchAndDisplayUsername = async (uid) => {
      try {
        const userRef = ref(FIRESTORE_DB, `users/${uid}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          const userData = snapshot.val();
          const fetchedUsername = userData && userData.username ? userData.username : 'No username';
          setDisplayedUsername(fetchedUsername);
        } else {
          console.log('No user data found in the database');
          setDisplayedUsername('No user data');
        }
      } catch (error) {
        console.error('Error fetching data: ', error);
        setDisplayedUsername('Error fetching data');
      }
    };

    if (user && !isLoading) {
      fetchAndDisplayUsername(user.uid);
    }
  }, [user, isLoading]);

  const toggleDeleteModal = () => {
    setDeleteModalVisible(!isDeleteModalVisible);
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
  
    try {
      // Delete user from Firebase Authentication
      await deleteUser(user);
  
      // Delete user data from Firestore
      const userRef = ref(FIRESTORE_DB, `users/${userUid}`);
      await remove(userRef);
  
      // Provide feedback to the user
      alert('Account deleted successfully!');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error deleting account: ', error);
      alert('Error deleting account: ' + error.message);
    } finally {
      setLoading(false);
      toggleDeleteModal(); // Close the modal after completion
    };
  };
  

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : userUid ? (
        <View>
          <Text>Your username: {displayedUsername || username}</Text>
          <TouchableOpacity style={styles.deleteButton} onPress={toggleDeleteModal}>
            <Text style={styles.deleteButtonText}>Delete Account</Text>
          </TouchableOpacity>

          {/* Delete Modal */}
          <Modal
            transparent
            animationType="slide"
            visible={isDeleteModalVisible}
            onRequestClose={toggleDeleteModal}
          >
            <View style={styles.modalBackground}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Delete Account?</Text>
                <Text style={styles.modalBody}>
                  Are you sure you want to delete your account? This action cannot be undone.
                </Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: 'red' }]}
                    onPress={handleDeleteAccount}
                  >
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: 'gray' }]}
                    onPress={toggleDeleteModal}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* Render the RegistrationForm component */}
          <RegistrationForm />
        </View>
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
  deleteButton: {
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  // Styles for the Delete Modal
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalBody: {
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
