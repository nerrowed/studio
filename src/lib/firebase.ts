import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// This function will initialize and get the Firestore instance.
// It will throw an error if config is missing, which can be caught inside the server action.
const getFirestoreInstance = () => {
  if (!firebaseConfig.projectId) {
    // A simple check for a key variable. If it's missing, the rest likely are too.
    throw new Error("Firebase configuration is incomplete. Please check your .env file and restart the server.");
  }
  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  return getFirestore(app);
};

export { getFirestoreInstance };
