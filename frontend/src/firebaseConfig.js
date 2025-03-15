import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDIum3mgV2KQKUo13iHWcNzY7r-4SPPwAg",
  authDomain: "medihive-cfa22.firebaseapp.com",
  projectId: "medihive-cfa22",
  storageBucket: "medihive-cfa22.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456",
  measurementId: "G-ABCDEFG123"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
