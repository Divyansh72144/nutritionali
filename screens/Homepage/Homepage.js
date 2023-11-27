import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { ref, set, get } from 'firebase/database';
import { FIRESTORE_DB } from '../Login/FirebaseConfig';
import { useFocusEffect } from '@react-navigation/native';
import { useAppContext } from '../../AppContext';
import { AntDesign } from '@expo/vector-icons';
import ProgressBar from "@ramonak/react-progress-bar"


export default function Homepage() {
  const { userUid, updateUserUid, username } = useAppContext();
  const [nutritionData, setNutritionData] = useState(null);
  const [consumedFood, setConsumedFood] = useState([]);
  const [foodName, setFoodName] = useState('');
  const [displayedUsername, setDisplayedUsername] = useState('');
  const [currentUserUid, setCurrentUserUid] = useState(null);
  const [isAddingFood, setAddingFood] = useState(false);

  useEffect(() => {
    if (userUid) {
      fetchAndDisplayUsername(userUid);
    }
  }, [userUid]);

  useEffect(() => {
    if (currentUserUid) {
      fetchAndDisplayConsumedFood();
    }
  }, [currentUserUid]);

  const fetchAndDisplayUsername = async (userUid) => {
    try {
      const userRef = ref(FIRESTORE_DB, `users/${userUid}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        setDisplayedUsername(snapshot.val().username);
        setCurrentUserUid(userUid);
        fetchAndDisplayConsumedFood();
      } else {
        console.log('No username found in the database');
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
      Alert.alert('Error', 'Failed to fetch username. See console for details.');
    }
  };

  const fetchAndDisplayConsumedFood = async () => {
    try {
      const userConsumedFoodRef = ref(
        FIRESTORE_DB,
        `users/${currentUserUid}/consumedFood`
      );

      const snapshot = await get(userConsumedFoodRef);

      if (snapshot.exists()) {
        const consumedFoodList = Object.values(snapshot.val()).map((foodObject) => {
          const foodName = foodObject.Food_name || foodObject.name;
          const nutrition = foodObject.Nutritional_Data[0] || foodObject.nutritional_data;
          return { name: foodName ,nutritional_data: nutrition};
        });

        setConsumedFood(consumedFoodList);
      } else {
        console.log('No consumed food found in the database');
        setConsumedFood([]);
      }
    } catch (error) {
      console.error('Error fetching consumed food: ', error);
      Alert.alert(
        'Error',
        'Failed to fetch consumed food. See console for details.'
      );
    }
  };

  const saveFood = async () => {
    try {
      const userConsumedFoodRef = ref(
        FIRESTORE_DB,
        `users/${currentUserUid}/consumedFood`
      );

      const snapshot = await get(userConsumedFoodRef);
      const existingData = snapshot.exists() ? snapshot.val() : {};

      const generateFoodId = () => {
        return Date.now().toString();
      };

      const foodId = generateFoodId();

      existingData[foodId] = { Food_name: foodName ,Nutritional_Data: nutritionData};

      await set(userConsumedFoodRef, existingData);

      Alert.alert('Success', 'Food saved successfully');
      fetchAndDisplayConsumedFood();
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
      console.log(data)
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

  const handleToggleAddingFood = () => {
    setAddingFood((prev) => !prev);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Daily Nutrition</Text>
        </View>
        <View style={styles.addButtonContainer}>
          <TouchableOpacity onPress={handleToggleAddingFood}>
            <View style={styles.addButton}>
              <AntDesign name="plus" size={24} color="black" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleToggleAddingFood}>
            <View style={styles.addButton}>
              <AntDesign name="calendar" size={24} color="black" />
            </View>
          </TouchableOpacity>
        </View>

        {isAddingFood && (
          <View style={styles.addFoodContainer}>
            <TextInput
              style={styles.input}
              onChangeText={handleInputChange}
              value={foodName}
              placeholder="Enter food name"
            />
            <Button title="Search" onPress={handleSearch} />
            <Button title="Add" onPress={saveFood} />

            {nutritionData && (
              <View style={styles.nutritionContainer}>
                <Text>Nutrition Data:</Text>
                <Text>Calories: {nutritionData[0].calories}</Text>
                <Text>Protein: {nutritionData[0].protein_g}gm</Text>
              </View>
            )}
          </View>
        )}

        <Text>Consumed Food:</Text>
        {consumedFood.map((food, index) => (
          <View key={index} style={styles.foodContainer}>
            <Text style={styles.foodName}>{food.name}</Text>
            {food.nutritional_data && (
              <View style={styles.nutritionContainer}>
                <Text>Nutrition Data:</Text>
                <Text>Calories: {food.nutritional_data.calories}</Text>
                <Text>Protein: {food.nutritional_data.protein_g}gm</Text>
                <ProgressBar completed ={50}/>
              </View>
            )}
          </View>
        ))}
        <StatusBar style="auto" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
  },
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
  addButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 20,
    right: 20,
    borderRadius: 50,
    backgroundColor: '#f1f3f4',
  },
  addButton: {
    padding: 10,
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2.5,
  },
  addFoodContainer: {
    marginBottom: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  foodContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  nutritionContainer: {
    marginTop: 5,
  },
});
