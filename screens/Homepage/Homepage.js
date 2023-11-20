import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import { ref, set, get } from 'firebase/database';
import { signOut, getAuth } from 'firebase/auth';
import { FIRESTORE_DB } from '../Login/FirebaseConfig'; // Update the path to your Firebase configuration
import { useNavigation } from '@react-navigation/native';

export default function Homepage({ userUid, updateUserUid }) {
  const [nutritionData, setNutritionData] = useState(null);
  const [consumedFood, setConsumedFood] = useState([]);
  const [foodName, setFoodName] = useState('');
  const [displayedUsername, setDisplayedUsername] = useState('');
  const [currentUserUid, setCurrentUserUid] = useState(null); // New state to store userUid

  useEffect(() => {
    // Fetch and display the username when the component mounts
    if (userUid) {
      fetchAndDisplayUsername(userUid);
    }
  }, [userUid]);

  const fetchAndDisplayUsername = async (userUid) => {
    try {
      // Set the currentUserUid state
      setCurrentUserUid(userUid);
      
      // Reference to the 'users' node in the Realtime Database
      const userRef = ref(FIRESTORE_DB, `users/${userUid}`);

      // Fetch the data from the database
      const snapshot = await get(userRef);

      console.log(userUid, snapshot, 'snapshot in homepage');
      console.log(currentUserUid)
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
  console.log(userUid)
  const saveFood = async () => {
    try {
      console.log('Saving Food:', foodName);
      console.log('User UID:', currentUserUid); // Access currentUserUid directly

      // Reference to a new child under the 'consumedFood' node for the specific user
      const userConsumedFoodRef = ref(
        FIRESTORE_DB,
        `users/${currentUserUid}/consumedFood`
      );

      // Use the 'push' method to generate a new child location with a unique key

      // Set the food details under the newly generated child location
      await set(userConsumedFoodRef, {
        Food_name: foodName,
        // Add other relevant properties here
      });

      Alert.alert('Success', 'Food saved successfully');

      // Fetch and display the updated username
      fetchAndDisplayUsername(currentUserUid);
    } catch (error) {
      console.error('Error setting data: ', error);
      Alert.alert('Error', 'Failed to save food. See console for details.');
    }
  };

  const fetchData = async (food) => {
    try {
      const apiKey = 'X8UgYiQX9yqdmJekNbxWsg==KWHE0hXyi9iQSSl2';
      const url = `https://api.api-ninjas.com/v1/nutrition?query=${food}`;
      const headers = {
        'X-Api-Key': apiKey,
      };

      const response = await fetch(url, { headers });
      if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      setNutritionData(data);
    } catch (error) {
      console.error('Request failed:', error);
    }
  };

  const handleInputChange = (text) => {
    setFoodName(text);
  };

  const handleSearch = () => {
    fetchData(foodName);
  };

  const handleAddition = () => {
    if (nutritionData && nutritionData.length > 0) {
      const updatedConsumedFood = [...consumedFood, { name: foodName, nutrition: nutritionData[0] }];
      setConsumedFood(updatedConsumedFood);
      setFoodName('');
      setNutritionData(null);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={handleInputChange}
        value={foodName}
        placeholder="Enter food name"
      />

      <Button title="Search" onPress={handleSearch} />
      <Button title="Add" onPress={saveFood} />

      {nutritionData && (
        <View>
          <Text>Nutrition Data:</Text>
          <Text>Calories: {nutritionData[0].calories}</Text>
          <Text>Protein: {nutritionData[0].protein_g}gm</Text>
          {/* Display other relevant nutrition properties */}
        </View>
      )}

      <Text>Consumed Food:</Text>
      {consumedFood.map((food, index) => (
        <View key={index}>
          <Text>{food.name}</Text>
        </View>
      ))}

      <StatusBar style="auto" />
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
