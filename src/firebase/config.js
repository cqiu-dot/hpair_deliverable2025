// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBc95OESB-RN5XZEEvvkiDnGi7Yp5lM4xs",
  authDomain: "hpair-deliverable.firebaseapp.com",
  projectId: "hpair-deliverable",
  storageBucket: "hpair-deliverable.firebasestorage.app",
  messagingSenderId: "605325142193",
  appId: "1:605325142193:web:bcb054b82464fe9a6c9a90",
  measurementId: "G-6TW9K7XQ5B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Analytics
const analytics = getAnalytics(app);

export default app;
