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
  updateDoc,
  where,
  WithFieldValue,
} from "firebase/firestore/lite";
import { get, getDatabase, push, ref, set } from "firebase/database";
import firebaseConfigFile from "./.firebase.config.json";
import { deepEqual } from "@firebase/util";
import EventEmitter from "events";

// Initialize Firebase
const app = initializeApp(firebaseConfigFile.result.sdkConfig);
const analytics = getAnalytics(app);

// Set up firestore
const firestore = getFirestore();
const realtime = getDatabase();

const UserConverter: FirestoreDataConverter<User> = {
  toFirestore: (user: WithFieldValue<User>) => user,
  fromFirestore: (snapshot: QueryDocumentSnapshot): User => {
    const data = snapshot.data();
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
  fromFirestore: (snapshot: QueryDocumentSnapshot): CourseList => {
    const data = snapshot.data();
    return {
      list: data.list,
    };
  },
};

let userPrivileges: Promise<{ admin: boolean; moderator: boolean }> =
  Promise.resolve({ admin: false, moderator: false });

let moderatorPromise: Promise<Array<{ user: User; uid: string }>>;

const userReady = new EventEmitter();

// Set up auth
const auth = getAuth();
auth.useDeviceLanguage();
setPersistence(auth, browserLocalPersistence);
let userSet = false;
onAuthStateChanged(auth, (user) => {
  userSet = true;
  if (coursesFetched) userReady.emit("ready");
  if (user === null)
    userPrivileges = Promise.resolve({ admin: false, moderator: false });
  else {
    userPrivileges = new Promise((resolve, _reject) => {
      set(ref(realtime, `users/${user.uid}/name`), user.displayName);
      set(ref(realtime, `users/${user.uid}/profilePhoto`), user.photoURL);
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
          set(ref(realtime, `users/${user.uid}/moderator`), userData.moderator);
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

function getModerators(): Promise<Array<{ user: User; uid: string }>> {
  return new Promise((resolve, reject) => {
    getDocs(
      query(
        collection(firestore, "users"),
        where("moderator", "==", true)
      ).withConverter(UserConverter)
    )
      .then((snapshot) => {
        resolve(
          snapshot.docs.map((doc) => ({ user: doc.data(), uid: doc.id }))
        );
      })
      .catch(reject);
  });
}

let coursesFetched = false;
function getUserByMail(emailId: string): Promise<{ user: User; uid: string }> {
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
        else
          resolve({ user: snapshot.docs[0].data(), uid: snapshot.docs[0].id });
      })
      .catch(reject);
  });
}

let allCourses = getAllCourses();
allCourses.then(() => {
  coursesFetched = true;
  if (userSet) userReady.emit("ready");
});

function addNewCourse(course: Course): Promise<void> {
  return new Promise((resolve, reject) => {
    allCourses.then((courses) => {
      courses.push(course);
      courses = courses.sort((courseA, courseB) =>
        courseA.code < courseB.code ? -1 : 1
      );
      setDoc(doc(firestore, "courses", "list").withConverter(CourseConverter), {
        list: courses,
      })
        .then(resolve)
        .catch(reject);
    });
  });
}

function editCourse(editedCourse: Course, id: number): Promise<void> {
  return new Promise((resolve, reject) => {
    allCourses.then((courses) => {
      const oldCourse = courses[id];
      const oldLinks = getLinksForCourse(oldCourse.code);
      courses[id] = editedCourse;
      courses = courses.sort((courseA, courseB) =>
        courseA.code < courseB.code ? -1 : 1
      );
      oldLinks
        .then((links) =>
          links.map((link) => {
            let newLink = link;
            newLink.link.course = editedCourse.code;
            return newLink;
          })
        )
        .then((newLinks) =>
          newLinks.map((newLink) =>
            set(
              ref(
                realtime,
                `links/${editedCourse.code.replaceAll("/", "?")}/${newLink.id}`
              ),
              newLink.link
            )
          )
        )
        .then(() =>
          oldLinks.then((links) =>
            links.map((link) =>
              set(
                ref(
                  realtime,
                  `users/${
                    link.link.owner.uid
                  }/links/${editedCourse.code.replaceAll("/", "!")}!${link.id}`
                ),
                true
              )
            )
          )
        )
        .then(() => oldLinks.then((links) => links.map((link) => link.id)))
        .then((idList) =>
          idList.map((id) =>
            get(
              ref(
                realtime,
                `reports/${oldCourse.code.replaceAll("/", "?")}!${id}`
              )
            )
          )
        )
        .then((reports) =>
          reports.map((report) =>
            report.then((report) =>
              set(
                ref(
                  realtime,
                  `reports/${editedCourse.code.replaceAll(
                    "/",
                    "?"
                  )}!${report.key?.substring(report.key.indexOf("!") + 1)}`
                ),
                report.toJSON()
              )
            )
          )
        )
        .then(() =>
          oldLinks.then((links) =>
            links.map((link) =>
              deleteLink(
                `${oldCourse.code.replaceAll("/", "?")}!${link.id}`,
                link.link.owner.uid
              )
            )
          )
        )
        .then(() =>
          set(
            ref(realtime, `links/${oldCourse.code.replaceAll("/", "?")}`),
            null
          )
        )
        .then(() =>
          setDoc(
            doc(firestore, "courses", "list").withConverter(CourseConverter),
            {
              list: courses,
            }
          )
        )
        .then(resolve)
        .catch(reject);
    });
  });
}

function deleteCourse(id: number): Promise<void> {
  return new Promise((resolve, reject) => {
    allCourses.then((courses) => {
      const oldCourse = courses[id];
      getLinksForCourse(oldCourse.code)
        .then((links) =>
          links.map((link) =>
            deleteLink(
              `${oldCourse.code.replaceAll("/", "?")}!${link.id}`,
              link.link.owner.uid
            )
          )
        )
        .then(() =>
          set(
            ref(realtime, `links/${oldCourse.code.replaceAll("/", "!")}`),
            null
          )
        )
        .then(() => {
          courses.splice(id, 1);
          setDoc(
            doc(firestore, "courses", "list").withConverter(CourseConverter),
            {
              list: courses,
            }
          );
        })
        .then(resolve)
        .catch(reject);
    });
  });
}

function updateModeratorStatus(uid: string, newStatus: boolean): Promise<void> {
  return new Promise((resolve, reject) => {
    updateDoc(doc(firestore, "users", uid).withConverter(UserConverter), {
      moderator: newStatus,
    })
      .then(() => {
        moderatorPromise = getModerators();
        resolve();
      })
      .catch(reject);
  });
}

function addNewLink(link: LinkObject): Promise<void> {
  const linkRef = push(
    ref(realtime, `links/${link.course.replaceAll("/", "?")}`)
  );
  return set(linkRef, link).then(() =>
    set(
      ref(
        realtime,
        `users/${auth.currentUser?.uid}/links/${link.course.replaceAll(
          "/",
          "?"
        )}!${linkRef.key}`
      ),
      true
    )
  );
}

function getLinksForCourse(
  code: string
): Promise<Array<{ id: string; link: LinkObject }>> {
  return new Promise((resolve, reject) => {
    get(ref(realtime, `links/${code.replaceAll("/", "?")}`))
      .then((snapshot) => {
        const linksArray: Array<{ id: string; link: LinkObject }> = [];
        snapshot.forEach((link) => {
          linksArray.push({
            id: link.key!!,
            link: link.toJSON() as LinkObject,
          });
        });
        resolve(linksArray);
      })
      .catch(reject);
  });
}

function reportLink(
  link: { id: string; link: LinkObject },
  reason: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    const courseRef = ref(
      realtime,
      `reports/${link.link.course.replaceAll("/", "?")}!${link.id}`
    );
    get(courseRef).then((snapshot) => {
      if (snapshot.hasChild(auth.currentUser?.uid!!))
        reject("already-reported");
      else
        set(
          ref(
            realtime,
            `reports/${link.link.course.replaceAll("/", "?")}!${link.id}/${auth
              .currentUser?.uid!!}`
          ),
          reason
        )
          .then(resolve)
          .catch(reject);
    });
  });
}

function getUserInfo(uid: string): Promise<UserDetails> {
  return new Promise((resolve, reject) => {
    get(ref(realtime, `users/${uid}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const links: string[] = [];
          let data: UserDetails = snapshot.toJSON() as UserDetails;
          snapshot.child("links").forEach((link) => {
            links.push(link.key?.replace("!", "/")!!);
          });
          resolve({
            name: data.name,
            profilePhoto: data.profilePhoto,
            moderator: data.moderator,
            links,
          });
        } else reject();
      })
      .catch(reject);
  });
}

function getFlaggedLinks(): Promise<Array<FlaggedLink>> {
  return new Promise((resolve, reject) => {
    get(ref(realtime, "reports"))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const flaggedLinks: Promise<FlaggedLink>[] = [];
          snapshot.forEach((link) => {
            flaggedLinks.push(
              new Promise((resolve, reject) => {
                const reports: { uid: string; reason: string }[] = [];
                link.forEach((report) => {
                  reports.push({ uid: report.key!!, reason: report.val() });
                });
                const linkId = link.key?.replace("!", "/")!!;
                get(ref(realtime, `links/${linkId}`))
                  .then((link) =>
                    resolve({
                      linkId,
                      reports,
                      link: link.toJSON() as LinkObject,
                    })
                  )
                  .catch(reject);
              })
            );
          });
          Promise.all(flaggedLinks).then(resolve).catch(reject);
        } else resolve([]);
      })
      .catch(reject);
  });
}

function deleteReports(id: string): Promise<void> {
  return set(ref(realtime, `reports/${id.replace("/", "!")}`), null);
}

function deleteLink(linkId: string, userId: string): Promise<void> {
  return deleteReports(linkId)
    .then(() => set(ref(realtime, `links/${linkId}`), null))
    .then(() =>
      set(
        ref(realtime, `users/${userId}/links/${linkId.replace("/", "!")}`),
        null
      )
    );
}

function getUserLinks(uid: string): Promise<Array<LinkWithKey>> {
  return new Promise((resolve, reject) => {
    get(ref(realtime, `users/${uid}/links`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const links: Promise<LinkWithKey>[] = [];
          snapshot.forEach((linkRef) => {
            links.push(
              get(
                ref(realtime, `links/${linkRef.key?.replace("!", "/")}`)
              ).then((link) => ({
                id: linkRef.key?.replace("!", "/")!!,
                link: link.toJSON() as LinkObject,
              }))
            );
          });
          Promise.all(links).then(resolve).catch(reject);
        } else resolve([]);
      })
      .catch(reject);
  });
}

export {
  app,
  analytics,
  auth,
  userReady,
  userPrivileges,
  getAllCourses,
  allCourses,
  getModerators,
  moderatorPromise,
  getUserByMail,
  addNewCourse,
  editCourse,
  deleteCourse,
  updateModeratorStatus,
  addNewLink,
  getLinksForCourse,
  reportLink,
  getUserInfo,
  getFlaggedLinks,
  deleteReports,
  deleteLink,
  getUserLinks,
};
