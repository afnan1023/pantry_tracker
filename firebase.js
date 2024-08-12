// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB6pj_XGyb6I9FkiY7eJGzGtclQbujn4fw",
  authDomain: "inventory-management-8c765.firebaseapp.com",
  projectId: "inventory-management-8c765",
  storageBucket: "inventory-management-8c765.appspot.com",
  messagingSenderId: "317604170426",
  appId: "1:317604170426:web:851089575dd9862370d083",
  measurementId: "G-T1FZ1XPZZD",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const firestore = getFirestore(app);
const auth = getAuth(app);

export {
  firestore,
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  doc,
  setDoc,
};
