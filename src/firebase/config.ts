
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDrZzwd0xj13F-ehbuKdxqT86c4ZbEyFLo",
  authDomain: "studenthub-a6c4e.firebaseapp.com",
  projectId: "studenthub-a6c4e",
  storageBucket: "studenthub-a6c4e.firebasestorage.app",
  messagingSenderId: "353133374127",
  appId: "1:353133374127:web:c3c50080fb2adce262825a",
  measurementId: "G-12ZFCG6MW6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

export default app;
