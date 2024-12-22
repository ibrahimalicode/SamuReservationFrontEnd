import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAwBJs0vZ3T5ZtQD7b8smqlwSmge9e7FWs",
  authDomain: "samu-reservation.firebaseapp.com",
  projectId: "samu-reservation",
  storageBucket: "samu-reservation.firebasestorage.app",
  messagingSenderId: "608455141245",
  appId: "1:608455141245:web:48dbc31083497ccca38e14",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
