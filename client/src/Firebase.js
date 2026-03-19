// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
   import { getAuth, GoogleAuthProvider } from "firebase/auth";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIRBASE_API_KEY,
  authDomain: "webgenerator-31435.firebaseapp.com",
  projectId: "webgenerator-31435",
  storageBucket: "webgenerator-31435.firebasestorage.app",
  messagingSenderId: "609120968015",
  appId: "1:609120968015:web:3f8e5715a7723c98bfb93a",
  measurementId: "G-Z31NNSVVF1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const Analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export {auth,provider}