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
interface Link {
  title: string;
  description: ?string;
  link: string;
  type: string;
  course: string;
  reports: {
    reason: string;
    reportedBy: string;
  }[];
}

// Course document
interface Course {
  code: string;
  title: string;
}
