import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAKSwMQBfF8U5S7ufA9zplnTbvgi7Rh4PQ",
  authDomain: "ijarax.firebaseapp.com",
  projectId: "ijarax",
  storageBucket: "ijarax.firebasestorage.app",
  messagingSenderId: "342681505449",
  appId: "1:342681505449:web:ef753eaa4af28fab3d63b8",
  measurementId: "G-H26MYN65SJ",
  databaseURL: "https://ijarax-default-rtdb.firebaseio.com"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const auth = getAuth(app);
const realtimeDb = getDatabase(app);

export { app, db, auth, realtimeDb };
