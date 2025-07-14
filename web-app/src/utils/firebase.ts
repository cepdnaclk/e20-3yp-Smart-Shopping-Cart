// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCjjD2t-cdSxyNN8zTEKc9-50pta6eleFs",
  authDomain: "smart-shopping-cart-481c7.firebaseapp.com",
  databaseURL: "https://smart-shopping-cart-481c7-default-rtdb.firebaseio.com",
  projectId: "smart-shopping-cart-481c7",
  storageBucket: "smart-shopping-cart-481c7.appspot.com",
  messagingSenderId: "113784057263",
  appId: "1:113784057263:web:0b1156a286c8e9a727935a",
};

const app = initializeApp(firebaseConfig); // ✅ Initialize App
// Initialize Realtime Database
const db = getDatabase(app);

// Initialize Firebase Authentication
const auth = getAuth(app);

export { db, auth };