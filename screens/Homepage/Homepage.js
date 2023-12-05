import React, { useState, useEffect ,useRef} from 'react';
import {StyleSheet,Text,View,TextInput,Button,Alert,TouchableOpacity,ScrollView,Image,Modal,Animated,Easing} from 'react-native';
import { ref, set, get ,update,remove} from 'firebase/database';
import { FIRESTORE_DB } from '../Login/FirebaseConfig';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useAppContext } from '../../AppContext';
import { AntDesign } from '@expo/vector-icons';
import { foodImages } from '../../media/gifs/FoodImages';
import {Dimensions} from 'react-native';
import Svg , {G,Circle} from 'react-native-svg'
import Donut from './donut';
import { SimpleLineIcons } from '@expo/vector-icons';
import DeleteButton from './Edit-Delete';
import TotalConsumption from './total_consumption';

// Add the FoodModal component here
const FoodModal = ({ isVisible, closeModal, food }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={closeModal}
    >
    <ScrollView>
    <View style={styles.modalBackground}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Food Details</Text>
          <View style={styles.modalBody}>
            <View style={styles.imageContainer}>
              <Image
                source={foodImages[food?.name.toLowerCase()]}
                style={{ width: 150, height: 150 }}
              />
              <Text>Food Name: {food?.name}</Text>
            </View>
            <View style={styles.donutsContainer}>
  <View style={styles.donutContainer}>
    <Donut
      percentage={food?.nutritional_data?.calories}
      radius={40}
      strokeWidth={10}
      duration={500}
      color="tomato"
      textColor="black"
      max={1000}
    />
    <Text>Calories (kcal)</Text>
  </View>
  <View style={styles.donutContainer}>
    <Donut
      percentage={food?.nutritional_data?.fat_total_g}
      radius={40}
      strokeWidth={10}
      duration={500}
      color="lightblue"
      textColor="black"
      max={50}
    />
    <Text>Fat</Text>
  </View>

  <View style={styles.donutContainer}>
    <Donut
      percentage={food?.nutritional_data?.protein_g}
      radius={40}
      strokeWidth={10}
      duration={500}
      color="lightgreen"
      textColor="black"
      max={50}
    />
    <Text>Protein (gm)</Text>
  </View>
  <View style={styles.donutContainer}>
    <Donut
      percentage={food?.nutritional_data?.carbohydrates_total_g}
      radius={40}
      strokeWidth={10}
      duration={500}
      color="lightgreen"
      textColor="black"
      max={50}
    />
    <Text>Carbohydrates</Text>
  </View>
  <View style={styles.donutContainer}>
    <Donut
      percentage={food?.nutritional_data?.cholesterol_mg}
      radius={40}
      strokeWidth={10}
      duration={500}
      color="lightgreen"
      textColor="black"
      max={100}
    />
    <Text>Cholestrol</Text>
  </View>
  <View style={styles.donutContainer}>
    <Donut
      percentage={food?.nutritional_data?.potassium_mg}
      radius={40}
      strokeWidth={10}
      duration={500}
      color="lightgreen"
      textColor="black"
      max={250}
    />
    <Text>Potassium (mg)</Text>
  </View>
  <View style={styles.donutContainer}>
    <Donut
      percentage={food?.nutritional_data?.sugar_g}
      radius={40}
      strokeWidth={10}
      duration={500}
      color="lightgreen"
      textColor="black"
      max={150}
    />
    <Text>Sugar (gm)</Text>
  </View>
</View>
            {/* <Text>Calories: {food?.nutritional_data?.calories}</Text>
            <Text>Protein: {food?.nutritional_data?.protein_g}gm</Text>
            <Text>Carbs: {food?.nutritional_data?.carbohydrates_total_g}gm</Text> */}
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      </View>
      </ScrollView>
    </Modal>
  );
};

export default function Homepage() {
  const { userUid, updateUserUid, username } = useAppContext();
  const [nutritionData, setNutritionData] = useState(null);
  const [consumedFood, setConsumedFood] = useState([]);
  const [foodName, setFoodName] = useState('');
  const [displayedUsername, setDisplayedUsername] = useState('');
  const [currentUserUid, setCurrentUserUid] = useState(null);
  const [isAddingFood, setAddingFood] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

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
          return { name: foodName, nutritional_data: nutrition };
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

  const handleDeleteFood = async (food) => {
    try {
      if (!food || !food.nutritional_data || !food.nutritional_data.name) {
        Alert.alert('Error', 'Invalid food data');
        return;
      }
  
      const userConsumedFoodRef = ref(
        FIRESTORE_DB,
        `users/${currentUserUid}/consumedFood`
      );
  
      const snapshot = await get(userConsumedFoodRef);
      const existingData = snapshot.exists() ? snapshot.val() : {};
  
      // Find the foodId by searching through each entry
      let foodId = null;
      Object.keys(existingData).forEach((key) => {
        const entry = existingData[key];
        if (
          entry &&
          entry.Food_name &&
          entry.Food_name.trim().toLowerCase() ===
            food.nutritional_data.name.trim().toLowerCase()
        ) {
          foodId = key;
        }
      });
  
      console.log('Before deletion', existingData);
      console.log(foodId);
  
      if (foodId) {
        // Remove the food entry by creating a new object without the key
        const updatedData = { ...existingData };
        delete updatedData[foodId];
  
        // Update the database with the modified data
        await set(userConsumedFoodRef, updatedData);
  
        // Call handleDelete method after successful deletion
        fetchAndDisplayConsumedFood();
      } else {
        Alert.alert('Error', 'Food not found in the database');
      }
    } catch (error) {
      console.error('Error deleting food: ', error);
      Alert.alert('Error', 'Failed to delete food. See console for details.');
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

      existingData[foodId] = { Food_name: foodName, Nutritional_Data: nutritionData };

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

  const handleToggleAddingFood = () => {
    setAddingFood((prev) => !prev);
  };

  const openModal = (food) => {
    setSelectedFood(food);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const navigateToFoodDetails = (foodName) => {
    navigation.navigate('Food', { foodName });
  };

  const renderProgressBar = (value, color) => {
    const progressBarHeight = `${value > 100 ? 100 : value}%`;

    return (
      <View style={styles.progressBarContainer}>
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <View
            style={[styles.progressBar, { height: progressBarHeight, backgroundColor: color }]}
          />
        </View>
      </View>
    );
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
              style={styles.textInput}
              onChangeText={handleInputChange}
              value={foodName}
              placeholder="Enter food name"
            />
             <TouchableOpacity style={styles.optionButton} onPress={handleSearch}>
                      <Text style={styles.optionButtonText}>Search</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.optionButton} onPress={saveFood}>
                      <Text style={styles.optionButtonText}>Add</Text>
                    </TouchableOpacity>

            {nutritionData && (
              <View style={styles.nutritionContainer}>
                <Text>Calories: {nutritionData[0].calories}</Text>
                {renderProgressBar((nutritionData[0].calories / 1000) * 100, '#3498db')}

                <Text>Protein: {nutritionData[0].protein_g}gm</Text>
                {renderProgressBar((nutritionData[0].protein_g / 50) * 100, '#2ecc71')}

                <Text>Carbs: {nutritionData[0].carbohydrates_total_g}gm</Text>
                {renderProgressBar((nutritionData[0].carbohydrates_total_g / 50) * 100, '#2ecc71')}
              </View>
            )}
          </View>
        )}


        <TotalConsumption></TotalConsumption>
        {/* Food Modal */}
        <FoodModal
          isVisible={isModalVisible}
          closeModal={closeModal}
          food={selectedFood}
        />

        <Text style={styles.consumedFoodHeaderText}>
          Consumed Food{'  '}
          <Image
            source={require('../../media/gifs/Other_images/woman.png')}
            style={{ width: 35, height: 35 }}
          />
        </Text>
        {consumedFood.map((food, index) => (
          <TouchableOpacity
          key={index}
          onPress={() => openModal(food)}
        >
          <View style={styles.foodContainer}>
            <TouchableOpacity onPress={() => openModal(food)}>
              <View style={styles.foodNameContainer}>
                {foodImages[food.name.toLowerCase()] && (
                  <Image
                    source={foodImages[food.name.toLowerCase()]}
                    style={{ width: 40, height: 40 }}
                  />
                )}
                <Text style={styles.foodName}>{food.name}</Text>
                <View style={styles.iconContainer}>
               <Text>
               {selectedFood && (
                  <DeleteButton
                    customIcon={<SimpleLineIcons name="options" size={24} color="black" />}
                    onDelete={() => handleDeleteFood(selectedFood)}
                  />
                )}
              </Text>

                                </View>
              </View>
            </TouchableOpacity>
              <Text>🔥{food.nutritional_data.calories} kcal</Text>

              {food.nutritional_data && (
                <View style={styles.nutritionContainer}>
                  {renderProgressBar(
                    (food.nutritional_data.calories / 1000) * 100,
                    '#3498db'
                  )}
                  <Text>
                    <Text style={{ fontWeight: 'bold', marginRight: 20 }}>
                      {food.nutritional_data.fat_total_g} gm
                    </Text>{' '}
                    {'\n'}
                    Fat
                  </Text>
                  {renderProgressBar(
                    (food.nutritional_data.protein_g / 50) * 100,
                    '#2ecc71'
                  )}
                  <Text>
                    <Text style={{ fontWeight: 'bold', marginRight: 20 }}>
                      {food.nutritional_data.protein_g} gm
                    </Text>{' '}
                    {'\n'}
                    Protein
                  </Text>
                  {renderProgressBar(
                    (food.nutritional_data.carbohydrates_total_g / 50) * 100,
                    '#3498db'
                  )}
                  <Text>
                    <Text style={{ fontWeight: 'bold', marginRight: 20 }}>
                      {food.nutritional_data.carbohydrates_total_g} gm
                    </Text>{' '}
                    {'\n'}
                    Carbs
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  donutsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  
  donutContainer: {
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50, 
    marginBottom:50
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Background color outside the modal
    justifyContent: 'flex-start', // Align to the top
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    
    
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalBody: {
    alignItems: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },


  scrollViewContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    width:"100%"
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 30,
    paddingHorizontal: 15,
    width: '100%',
    fontSize: 18,
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
    padding: 15,
    borderRadius: 75,
    width: 55,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
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
    padding: 20,
    marginBottom: 20,
    borderRadius: 10,
    width:"100%"
  },
  foodName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  nutritionContainer: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
   
  },
  progressBarContainer: {
    width: 8,
    height: 70,
    backgroundColor: '#ecf0f1',
    borderRadius: 7.5,
    overflow: 'hidden',
    marginTop: 10,
  },
  progressBar: {
    height: '100%',
  },
  foodNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  consumedFoodHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
  },
  iconContainer: {
    marginLeft: 'auto', // Move the SimpleLineIcons to the end
  },
  optionButton: {
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  optionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  
  textInput: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 30,
    paddingHorizontal: 15,
    width: '100%',
    fontSize: 18,
    borderRadius: 5, // Adjust the border radius as needed
  },
});
