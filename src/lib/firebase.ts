import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Firebase configuration
// Replace these with your actual Firebase config values
const firebaseConfig = {
  apiKey: "AIzaSyCKvN8c3g3bvvfQqS5F7VuIb_LT2Piz37o",
  authDomain: "gen-lang-client-0185007753.firebaseapp.com",
  projectId: "gen-lang-client-0185007753",
  storageBucket: "gen-lang-client-0185007753.firebasestorage.app",
  messagingSenderId: "148466751338",
  appId: "1:148466751338:web:050d548c9eab57e8923713"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Connect to emulators in development
if (import.meta.env.DEV) {
  // Uncomment these lines if you want to use Firebase emulators in development
  // connectFirestoreEmulator(db, 'localhost', 8080);
  // connectAuthEmulator(auth, 'http://localhost:9099');
  // connectStorageEmulator(storage, 'localhost', 9199);
}

export default app;
