
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from 'firebase/messaging';


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "eventify-7f80f.firebaseapp.com",
  projectId: "eventify-7f80f",
  storageBucket: "eventify-7f80f.firebasestorage.app",
  messagingSenderId: "69715184163",
  appId: "1:69715184163:web:b0c34ba58bbd551cfeff96",
  measurementId: "G-XDZ8WHE78G",
  vapidKey: import.meta.env.VITE_VAPID_KEY 
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);


export { messaging, getToken, onMessage };
