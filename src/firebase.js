import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
// *For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyArMisAU6JyArxkBmXiIauvBHD-HCaKEHY",
  authDomain: "qpq-9193a.firebaseapp.com",
  projectId: "qpq-9193a",
  storageBucket: "qpq-9193a.appspot.com",
  messagingSenderId: "466972423715",
  appId: "1:466972423715:web:d107005762da84241e6396",
  measurementId: "G-EEHPPXYVG0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Auth domains
export const auth = getAuth();
export const googleProvider = new GoogleAuthProvider();

// Firebase storage and firestore
export const storage = getStorage();
export const db = getFirestore();