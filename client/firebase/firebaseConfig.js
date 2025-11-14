// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBh1gCiAjI5EZzw6ramniOmIt8yScjwfu4",
  authDomain: "sahayogred.firebaseapp.com",
  projectId: "sahayogred",
  storageBucket: "sahayogred.firebasestorage.app",
  messagingSenderId: "735884438835",
  appId: "1:735884438835:web:22fee40fc5878262ba2246",
  measurementId: "G-NSWCQ6T5GP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;