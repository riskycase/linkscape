// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  browserLocalPersistence,
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

const CourseConverter: FirestoreDataConverter<CourseList> = {
  toFirestore: (courseList: WithFieldValue<CourseList>) => courseList,
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): CourseList => {
    const data = snapshot.data(options);
    return {
      list: data.list,
    };
  },
};

let userPrivileges: Promise<{ admin: boolean; moderator: boolean }> =
  Promise.resolve({ admin: false, moderator: false });

// Set up auth
const auth = getAuth();
auth.useDeviceLanguage();
setPersistence(auth, browserLocalPersistence);
onAuthStateChanged(auth, (user) => {
  if (user === null)
    userPrivileges = Promise.resolve({ admin: false, moderator: false });
  else
    userPrivileges = new Promise((resolve, reject) => {
      const userData: User = {
        name: user.displayName!!,
        emailId: user.email!!,
        profilePhoto: user.photoURL!!,
        moderator: false,
        admin: false,
      };
      getDoc(
        doc(firestore, "users", user.uid).withConverter(UserConverter)
      ).then((snapshot) => {
        if (snapshot.exists()) {
          userData.admin = snapshot.data().admin;
          userData.moderator = snapshot.data().moderator;
          if (!deepEqual(userData, snapshot.data()))
            setDoc(doc(firestore, "user", user.uid), userData);
        } else setDoc(doc(firestore, "user", user.uid), userData);
        resolve({ admin: userData.admin, moderator: userData.moderator });
      });
    });
});

function getAllCourses(): Promise<Array<Course>> {
  return new Promise((resolve, reject) => {
    getDoc(doc(firestore, "courses", "list").withConverter(CourseConverter))
      .then((snapshot) => resolve(snapshot.data()?.list!!))
      .catch(reject);
  });
}

export { app, analytics, auth, userPrivileges, getAllCourses };
