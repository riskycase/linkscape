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
}

// Course document
interface Course {
  code: string;
  title: string;
}

interface CourseList {
  list: Course[];
}

// User details
interface UserDetails {
  name: string;
  profilePhoto: string;
  moderator: boolean;
  links: string[];
}

// Flagged link convenience object
interface FlaggedLink {
  linkId: string;
  reports: { uid: string; reason: string }[];
  link: LinkObject;
}

// Link object with  key
interface LinkWithKey {
  id: string;
  link: LinkObject;
}
