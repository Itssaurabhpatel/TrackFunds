// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBi_ZLljuSgUyWxIA1VQvxk6QB3vXLXGD4",
  authDomain: "finance-tracker-4f3ac.firebaseapp.com",
  projectId: "finance-tracker-4f3ac",
  storageBucket: "finance-tracker-4f3ac.appspot.com",
  messagingSenderId: "726572567614",
  appId: "1:726572567614:web:30bff0e6ad781ef019956f",
  measurementId: "G-G79RX676YE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider, doc, setDoc };