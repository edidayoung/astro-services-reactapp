// Firebase Configuration for React App
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration (same as old site)
const firebaseConfig = {
  apiKey: "AIzaSyB-ASmswDHvDk1sIcwbEZjFEjOZouRhJbA",
  authDomain: "astro-f9559.firebaseapp.com",
  projectId: "astro-f9559",
  storageBucket: "astro-f9559.firebasestorage.app",
  messagingSenderId: "714372793660",
  appId: "1:714372793660:web:ba2ac62033b61d03a74a39"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
