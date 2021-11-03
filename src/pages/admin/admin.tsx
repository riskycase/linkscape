import {
  faBookReader,
  faChevronLeft,
  faUsersCog,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { allCourses, auth, moderatorPromise } from "../../firebase";
import Styles from "./admin.module.scss";
import ActionCard from "./components/actionCard/actionCard";
import CoursePanel from "./components/coursePanel/coursePanel";
import ModeratorPanel from "./components/moderatorPanel/moderatorPanel";

function Admin() {
  const [panel, setPanel] = useState("main");
  const [courseCount, setCourseCount] = useState(0);
  const [moderatorCount, setModeratorCount] = useState(0);
  moderatorPromise.then((moderators) => setModeratorCount(moderators.length));
  allCourses.then((courses) => setCourseCount(courses.length));
  return (
    <div className={Styles.body}>
      {panel !== "main" && (
        <button
          className={`uk-button uk-button-primary uk-button-small ${Styles.backButton}`}
          onClick={() => setPanel("main")}
        >
          <FontAwesomeIcon icon={faChevronLeft} className={Styles.backIcon} />
          <span className={Styles.backText}>Back</span>
        </button>
      )}
      {panel === "main" && (
        <span className={Styles.headerText}>
          Welcome, {auth.currentUser?.displayName}!
        </span>
      )}
      <span className={Styles.headerSubText}>
        {panel === "main" && "What would you like to do today?"}
        {panel === "moderator" &&
          (moderatorCount === 1
            ? "There is currently 1 moderator"
            : `There are currently ${moderatorCount} moderators`)}
        {panel === "course" && `Course list has ${courseCount} courses`}
      </span>
      {panel === "main" && (
        <div className={Styles.mainPanel}>
          <ActionCard
            icon={faUsersCog}
            text="Manage moderators"
            action={() => setPanel("moderator")}
          />
          <ActionCard
            icon={faBookReader}
            text="Edit course list"
            action={() => setPanel("course")}
          />
        </div>
      )}
      {panel === "moderator" && <ModeratorPanel />}
      {panel === "course" && <CoursePanel />}
    </div>
  );
}

export default Admin;
