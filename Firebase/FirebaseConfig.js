// Import the individual Firebase modules
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration object
const firebaseConfig = {
    apiKey: "AIzaSyCOjTtRfoP_n9p1NeRQyyzBqOChpvVZNcY",
    authDomain: "praytime-988ca.firebaseapp.com",
    projectId: "praytime-988ca",
    storageBucket: "praytime-988ca.appspot.com",
    messagingSenderId: "463324535591",
    appId: "1:463324535591:web:91f61604bcce6540106702"
  };

// Initialize Firebase app
const firebaseApp = initializeApp(firebaseConfig);

// Get Firebase services
const auth = getAuth(firebaseApp);
const database = getDatabase(firebaseApp);
const firestore = getFirestore(firebaseApp);
export { auth, database, firestore };

