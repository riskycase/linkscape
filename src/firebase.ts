// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  browserSessionPersistence,
  getAuth,
  onAuthStateChanged,
  setPersistence,
} from "firebase/auth";
import {
  doc,
  FirestoreDataConverter,
  getDoc,
  getFirestore,
  QueryDocumentSnapshot,
  setDoc,
  SnapshotOptions,
  WithFieldValue,
} from "firebase/firestore";
import firebaseConfigFile from "./.firebase.config.json";
import { deepEqual } from "@firebase/util";

// Initialize Firebase
const app = initializeApp(firebaseConfigFile.result.sdkConfig);
const analytics = getAnalytics(app);

// Set up firestore
const firestore = getFirestore();

const UserConverter: FirestoreDataConverter<User> = {
  toFirestore: (user: WithFieldValue<User>) => user,
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): User => {
    const data = snapshot.data(options);
    return {
      name: data.name,
      emailId: data.emailId,
      profilePhoto: data.profilePhoto,
      moderator: data.moderator,
      admin: data.admin,
    };
  },
};

// Set up auth
const auth = getAuth();
auth.useDeviceLanguage();
setPersistence(auth, browserSessionPersistence);
onAuthStateChanged(auth, (user) => {
  if (user !== null) {
    getDoc(doc(firestore, "users", user.uid).withConverter(UserConverter)).then(
      (docData) => {
        const userData: User = {
          name: user.displayName!!,
          emailId: user.email!!,
          profilePhoto: user.photoURL!!,
          moderator: false,
          admin: false,
        };
        // Write user data without administrative rights if doesn't exist
        if (!docData.exists())
          setDoc(doc(firestore, "users", user.uid), userData);
        // If exists, preserve administrative data and update if needed
        else {
          userData.admin = docData.data().admin;
          userData.moderator = docData.data().moderator;
          if (!deepEqual(docData.data(), userData))
            setDoc(doc(firestore, "users", user.uid), userData);
        }
      }
    );
  }
});

export { app, analytics, auth };
