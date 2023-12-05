import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ref, get } from 'firebase/database';
import { FIRESTORE_DB } from '../Login/FirebaseConfig';
import { useAppContext } from '../../AppContext';
import DonutTotal from './donutTotal'

const TotalConsumption = () => {
  const { userUid } = useAppContext();
  const [totalConsumption, setTotalConsumption] = useState({
    calories: 0,
    protein: 0,
    fat: 0,
    carbohydrates: 0,
    cholesterol: 0,
    potassium: 0,
    sugar: 0,
  });

  useEffect(() => {
    if (userUid) {
      fetchTotalConsumption(userUid);
    }
  }, [userUid]);

  const fetchTotalConsumption = async (userUid) => {
    try {
      const userConsumedFoodRef = ref(
        FIRESTORE_DB,
        `users/${userUid}/consumedFood`
      );
      const snapshot = await get(userConsumedFoodRef);
      console.log(snapshot);
      if (snapshot.exists()) {
        const consumedFoodList = Object.values(snapshot.val()).map(
          (foodObject) => {
            return foodObject.Nutritional_Data[0]; // Adjust the path to Nutritional_Data
          }
        );
        console.log(consumedFoodList);
        // Calculate total consumption
        const total = consumedFoodList.reduce(
          (accumulator, currentValue) => {
            accumulator.calories += currentValue.calories || 0;
            accumulator.protein += currentValue.protein_g || 0;
            accumulator.fat += currentValue.fat_total_g || 0;
            accumulator.carbohydrates += currentValue.carbohydrates_total_g || 0;
            accumulator.cholesterol += currentValue.cholesterol_mg || 0;
            accumulator.potassium += currentValue.potassium_mg || 0;
            accumulator.sugar += currentValue.sugar_g || 0;
            return accumulator;
          },
          {
            calories: 0,
            protein: 0,
            fat: 0,
            carbohydrates: 0,
            cholesterol: 0,
            potassium: 0,
            sugar: 0,
          }
        );

        setTotalConsumption(total);
      } else {
        console.log('No consumed food found in the database');
        setTotalConsumption({
          calories: 0,
          protein: 0,
          fat: 0,
          carbohydrates: 0,
          cholesterol: 0,
          potassium: 0,
          sugar: 0,
        });
      }
    } catch (error) {
      console.error('Error fetching total consumption: ', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
     
      <View style={styles.totalConsumptionContainer}>
        
        {/* <Text style={styles.totalConsumptionText}>
          Calories: {totalConsumption.calories} kcal
        </Text>
        <Text style={styles.totalConsumptionText}>
          Protein: {totalConsumption.protein} gm
        </Text>
        <Text style={styles.totalConsumptionText}>
          Fat: {totalConsumption.fat} gm
        </Text>
        <Text style={styles.totalConsumptionText}>
          Carbohydrates: {totalConsumption.carbohydrates} gm
        </Text>
        <Text style={styles.totalConsumptionText}>
          Cholesterol: {totalConsumption.cholesterol} mg
        </Text>
        <Text style={styles.totalConsumptionText}>
          Potassium: {totalConsumption.potassium} mg
        </Text>
        <Text style={styles.totalConsumptionText}>
          Sugar: {totalConsumption.sugar} gm
        </Text> */}
         <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Total Consumption</Text>
      </View>
        <View style={styles.donutsContainer}>
    <View style={styles.donutContainer}>
    <DonutTotal
      percentage={totalConsumption.calories}
      radius={110}
      strokeWidth={10}
      duration={500}
      color="tomato"
      textColor="black"
      max={10000}
    />
    <Text style={{ fontSize: 18 }}>Total Calories</Text>
    </View>
    <View style={styles.donutContainer}>
    <DonutTotal
      percentage={totalConsumption.protein}
      radius={40}
      strokeWidth={10}
      duration={500}
      color="lightgreen"
      textColor="black"
      max={10000}
    />
    <Text>Total Protein</Text>
    </View>
    <View style={styles.donutContainer}>
    <DonutTotal
      percentage={totalConsumption.fat}
      radius={40}
      strokeWidth={10}
      duration={500}
      color="lightblue"
      textColor="black"
      max={10000}
    />
        <Text>Total Fat</Text>
    </View>
    <View style={styles.donutContainer}>
    <DonutTotal
      percentage={totalConsumption.carbohydrates}
      radius={40}
      strokeWidth={10}
      duration={500}
      color="tomato"
      textColor="black"
      max={10000}
    />
    <Text>Total Carbs</Text>
    </View>
    
    <View style={styles.donutContainer}>
    <DonutTotal
      percentage={totalConsumption.cholesterol}
      radius={40}
      strokeWidth={10}
      duration={500}
      color="tomato"
      textColor="black"
      max={10000}
    />
    <Text>Total Chol</Text>
    </View>
    </View>
      </View>
    </ScrollView>
  );
};

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
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
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
  totalConsumptionContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 20,
    marginBottom: 20,
    borderRadius: 10,
  },
  totalConsumptionText: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default TotalConsumption;
