// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC_YjkXIedC3W9IEDZuZ-Fz2UUtHRQouDo",
  authDomain: "nutritionali-40a24.firebaseapp.com",
  projectId: "nutritionali-40a24",
  storageBucket: "nutritionali-40a24.appspot.com",
  messagingSenderId: "173313735053",
  appId: "1:173313735053:web:52e1bca2a797582c8ce5c4",
  measurementId: "G-G2BXMW9SNL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;