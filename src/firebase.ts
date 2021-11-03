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
  collection,
  doc,
  FirestoreDataConverter,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  query,
  QueryDocumentSnapshot,
  setDoc,
  SnapshotOptions,
  where,
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

let moderatorPromise: Promise<Array<User>>;

// Set up auth
const auth = getAuth();
auth.useDeviceLanguage();
setPersistence(auth, browserLocalPersistence);
onAuthStateChanged(auth, (user) => {
  if (user === null)
    userPrivileges = Promise.resolve({ admin: false, moderator: false });
  else {
    userPrivileges = new Promise((resolve, _reject) => {
      getDoc(
        doc(firestore, "users", user.uid).withConverter(UserConverter)
      ).then((docData) => {
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
        if (userData.admin) moderatorPromise = getModerators();
        resolve({ admin: userData.admin, moderator: userData.moderator });
      });
    });
  }
});

function getAllCourses(): Promise<Array<Course>> {
  return new Promise((resolve, reject) => {
    getDoc(doc(firestore, "courses", "list").withConverter(CourseConverter))
      .then((snapshot) => {
        resolve(snapshot.data()?.list!!);
        allCourses = Promise.resolve(snapshot.data()?.list!!);
      })
      .catch(reject);
  });
}

function getModerators(): Promise<Array<User>> {
  return new Promise((resolve, reject) => {
    getDocs(
      query(
        collection(firestore, "users"),
        where("moderator", "==", true)
      ).withConverter(UserConverter)
    )
      .then((snapshot) => {
        resolve(snapshot.docs.map((doc) => doc.data()));
      })
      .catch(reject);
  });
}

function getUserByMail(emailId: string): Promise<User> {
  return new Promise((resolve, reject) => {
    getDocs(
      query(
        collection(firestore, "users"),
        where("emailId", "==", emailId),
        limit(1)
      ).withConverter(UserConverter)
    )
      .then((snapshot) => {
        if (snapshot.empty) reject("not-exist");
        else resolve(snapshot.docs[0].data());
      })
      .catch(reject);
  });
}

let allCourses = getAllCourses();

export {
  app,
  analytics,
  auth,
  userPrivileges,
  getAllCourses,
  allCourses,
  getModerators,
  moderatorPromise,
  getUserByMail,
};
