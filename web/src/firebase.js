import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBiAG-ii59UWQvuukzbJiqWMa-MZqSsJT8',
  authDomain: 'vanakkamfm-dabeb.firebaseapp.com',
  projectId: 'vanakkamfm-dabeb',
  storageBucket: 'vanakkamfm-dabeb.firebasestorage.app',
  messagingSenderId: '431002476586',
  appId: '1:431002476586:web:c09551500e8fb203b36353',
  measurementId: 'G-32VDE0SLLY',
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
