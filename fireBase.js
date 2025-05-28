import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { EmailAuthProvider, reauthenticateWithCredential, sendPasswordResetEmail, deleteUser, verifyBeforeUpdateEmail, updateEmail, updateProfile, updatePassword, sendEmailVerification, signInWithPopup, GoogleAuthProvider, getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import {doc,updateDoc,  getDoc, setDoc, getFirestore, collection, addDoc, getDocs , query, where,} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyCncgSAUHaWSTnqV1SQe6QilpuI1JfbrX8",
  authDomain: "pathan-ka-hotel-c9dba.firebaseapp.com",
  projectId: "pathan-ka-hotel-c9dba",
  storageBucket: "pathan-ka-hotel-c9dba.firebasestorage.app",
  messagingSenderId: "816274823756",
  appId: "1:816274823756:web:20fb9c6b8ed623cc2b72e9",
  measurementId: "G-CE8GPGM0XL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

// console.log(app);


export {
  auth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  googleProvider,
  signInWithPopup,
  GoogleAuthProvider,
  sendEmailVerification,
  updatePassword,
  updateProfile,
  updateEmail,
  verifyBeforeUpdateEmail,
  deleteUser,
  sendPasswordResetEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
  doc, 
  setDoc,
  db,
  getDoc,
  addDoc,
  collection,
  query, 
  where,
  getDocs,
  updateDoc,

}



