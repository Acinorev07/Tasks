import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDtB4TKJ4W6GZt6EbQq9A8sN43PbU0Ud3M",
  authDomain: "tasks-257f7.firebaseapp.com",
  projectId: "tasks-257f7",
  storageBucket: "tasks-257f7.appspot.com",
  messagingSenderId: "787588752340",
  appId: "1:787588752340:web:3097e41d970581dec9ec41",
  measurementId: "G-8WJLVG36B5"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Obtiene la instancia de Firestore
const db = getFirestore(app);

export { db };