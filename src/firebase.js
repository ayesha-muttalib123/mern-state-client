// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// import.meta.env.Vite_Firebase_Api_Key
const firebaseConfig = {
  apiKey: "AIzaSyAb3wZCdbKIflpVbyUCkqzUiUJYQIOJJLg",
  authDomain: "mern-estate-47eef.firebaseapp.com",
  projectId: "mern-estate-47eef",
  storageBucket: "mern-estate-47eef.appspot.com",
  messagingSenderId: "612709685589",
  appId: "1:612709685589:web:dbed5a4406d0325739b7dc",
  measurementId: "G-L28T4QMYDV"
};

// Initialize Firbase 
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);