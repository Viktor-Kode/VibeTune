// firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBAeMVLOMeIhwUp5pXiVMPOzLDEI4lYxeo",
  authDomain: "vibetune-6ef04.firebaseapp.com",
  projectId: "vibetune-6ef04",
  storageBucket: "vibetune-6ef04.appspot.com",
  messagingSenderId: "583747273318",
  appId: "1:583747273318:web:01a2fdfe0530c132ada3a7",
  measurementId: "G-K5TVH0NSR3"
};

const app = initializeApp(firebaseConfig);
getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app); // 🔥 Firestore added here
const provider = new GoogleAuthProvider();

export const signWithGoogle = () => {
  signInWithPopup(auth, provider)
    .then((res) => {
      console.log("Google user:", res.user);
      window.location.href = "/dashboard";
    })
    .catch((err) => {
      alert("Google sign-in error: " + err.message);
    });
};

export const registerWithEmail = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const loginWithEmail = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};