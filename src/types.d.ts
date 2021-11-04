// Type definitions for firestore data

// User document
interface User {
  name: string;
  emailId: string;
  profilePhoto: string;
  moderator: boolean;
  admin: boolean;
}

// Link document
interface LinkObject {
  title: string;
  link: string;
  course: string;
  owner: { uid: string; name: string };
  reports: {
    [key: string]: {
      reason: string;
      reportedBy: string;
    };
  };
}

// Course document
interface Course {
  code: string;
  title: string;
}

interface CourseList {
  list: Course[];
}
