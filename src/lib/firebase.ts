import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDamUIfek_-6l0fhVgpOuyc-CI_ZCanslk",
  authDomain: "unspoken-box1n.firebaseapp.com",
  projectId: "unspoken-box1n",
  storageBucket: "unspoken-box1n.firebasestorage.app",
  messagingSenderId: "324757395832",
  appId: "1:324757395832:web:2257035485057f3d34d08d"
};

// This function will initialize and get the Firestore instance.
// It will throw an error if config is missing, which can be caught inside the server action.
const getFirestoreInstance = () => {
  if (!firebaseConfig.projectId) {
    // A simple check for a key variable. If it's missing, the rest likely are too.
    throw new Error("Firebase configuration is incomplete.");
  }
  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  return getFirestore(app);
};

export { getFirestoreInstance };
