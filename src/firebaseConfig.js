import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCxaVDccHNZcZnN_uG7eDrAJx5sRHSSYhk",
  authDomain: "pdasa-b674a.firebaseapp.com",
  projectId: "pdasa-b674a",
  storageBucket: "pdasa-b674a.firebasestorage.app",
  messagingSenderId: "758668402524",
  appId: "1:758668402524:web:bd62955885f8e4a77eab99"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 🔹 Agregar onAuthStateChanged a la exportación
export { auth, signInWithEmailAndPassword, signOut, onAuthStateChanged, db };