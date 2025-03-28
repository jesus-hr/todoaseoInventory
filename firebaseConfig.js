// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCxaVDccHNZcZnN_uG7eDrAJx5sRHSSYhk",
  authDomain: "pdasa-b674a.firebaseapp.com",
  projectId: "pdasa-b674a",
  storageBucket: "pdasa-b674a.firebasestorage.app",
  messagingSenderId: "758668402524",
  appId: "1:758668402524:web:bd62955885f8e4a77eab99"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export { auth, signInWithEmailAndPassword, signOut, db };