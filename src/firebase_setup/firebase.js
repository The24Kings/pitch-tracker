// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAvYVvoIlCDY9YJesKBvXmYkDYOPo-68fo",
  authDomain: "pitch-tracker-92ddf.firebaseapp.com",
  projectId: "pitch-tracker-92ddf",
  storageBucket: "pitch-tracker-92ddf.appspot.com",
  messagingSenderId: "979367841378",
  appId: "1:979367841378:web:3612cbe4649fd22a0a8b3b",
  measurementId: "G-8BJRKZC9ZG"
};
const addPlayerToFirebase = async (playerName) => {
  try {
    const docRef = await db.collection('users').add({
      username: playerName,
      pitchStats: {} // Initialize with empty pitch stats
    });
    console.log("Player added with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding player: ", error);
    throw error; // You might want to handle this error in your UI
  }
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export { addPlayerToFirebase };
