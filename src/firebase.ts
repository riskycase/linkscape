// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  browserSessionPersistence,
  getAuth,
  setPersistence,
} from "firebase/auth";
import firebaseConfigFile from "./.firebase.config.json";

// Initialize Firebase
const app = initializeApp(firebaseConfigFile.result.sdkConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
auth.useDeviceLanguage();
setPersistence(auth, browserSessionPersistence);

export { app, analytics, auth };
