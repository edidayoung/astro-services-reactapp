// Firebase Configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Your web app's Firebase configuration
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

// Export Firebase services
export { db, collection, getDocs, addDoc, updateDoc, deleteDoc, doc };
