// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, getAuth, browserLocalPersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from "react-native";


const firebaseConfig = {
  apiKey: "AIzaSyDU7xzoBYho-Dx3VjM8nduh13QJJaMlMsA",
  authDomain: "wallet-app-63744.firebaseapp.com",
  projectId: "wallet-app-63744",
  storageBucket: "wallet-app-63744.firebasestorage.app",
  messagingSenderId: "563576446418",
  appId: "1:563576446418:web:42746e06ade03936f47c0b",
  measurementId: "G-V65YV5W9Q2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

let auth;

if (Platform.OS === 'web') {
  // On Web, we use the standard getAuth() which uses localStorage automatically
  auth = getAuth(app);
  // Or explicitly: auth = initializeAuth(app, { persistence: browserLocalPersistence });
} else {
  // On Mobile (iOS/Android), we use AsyncStorage
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
}

export { auth };