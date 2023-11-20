import { initializeApp } from 'firebase/app';
import {getAuth} from "firebase/auth";
import {getDatabase, ref, push} from "firebase/database";

const firebaseConfig = {

    apiKey: "AIzaSyC_YjkXIedC3W9IEDZuZ-Fz2UUtHRQouDo",
  
    authDomain: "nutritionali-40a24.firebaseapp.com",
  
    databaseURL: "https://nutritionali-40a24-default-rtdb.europe-west1.firebasedatabase.app",
  
    projectId: "nutritionali-40a24",
  
    storageBucket: "nutritionali-40a24.appspot.com",
  
    messagingSenderId: "173313735053",
  
    appId: "1:173313735053:web:52e1bca2a797582c8ce5c4",
  
    measurementId: "G-G2BXMW9SNL"
  
  };

 
const FIREBASE_APP = initializeApp(firebaseConfig);
const FIREBASE_AUTH = getAuth(FIREBASE_APP);
const FIRESTORE_DB = getDatabase(FIREBASE_APP);

export { FIREBASE_APP, FIREBASE_AUTH, FIRESTORE_DB };