// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCoawUFxg1sTJMUqQM5J6mijzC_IDRO2D0",
  authDomain: "dashboard2-53463.firebaseapp.com",
  projectId: "dashboard2-53463",
  storageBucket: "dashboard2-53463.appspot.com",
  messagingSenderId: "391916755011",
  appId: "1:391916755011:web:861648ea70ac1231229cf6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {auth, db}