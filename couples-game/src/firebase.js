// Shared Firebase instances used by the app.
// NOTE: this web config is public by design (Firebase web keys are not secrets).
// Real privacy comes from Firebase Auth + the Firestore security rules in
// ../firestore.rules — deploy those rules or the data is world-open.
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAnIL9zHwM65mk-axj9pOmf83LeueYyV-s",
  authDomain: "couples-game-2fec8.firebaseapp.com",
  projectId: "couples-game-2fec8",
  storageBucket: "couples-game-2fec8.firebasestorage.app",
  messagingSenderId: "126628558435",
  appId: "1:126628558435:web:524b7c96f0fa68e8806a56",
  measurementId: "G-RE79G996WL"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
