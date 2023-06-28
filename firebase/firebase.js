// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyB77qYSh3sGmsH6B8qTsNmJHp0ApnhY1j4",
  authDomain: "todo-app-firebase-cde38.firebaseapp.com",
  projectId: "todo-app-firebase-cde38",
  storageBucket: "todo-app-firebase-cde38.appspot.com",
  messagingSenderId: "434208237752",
  appId: "1:434208237752:web:99fd05b098b921896cec4d",
  measurementId: "G-8CS1BD3HQ6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app)
export const db = getFirestore(app)
