// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore, onAuthStateChanged } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Replace with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyACD5HI-FwQqDVEajP_q2QtjW-iRlZV-2Q",
  authDomain: "lostback-e6fac.firebaseapp.com",
  projectId: "lostback-e6fac",
  storageBucket: "lostback-e6fac.firebasestorage.app",
  messagingSenderId: "752107934516",
  appId: "1:752107934516:android:bc1fcd39ce5b10c6030b61"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
