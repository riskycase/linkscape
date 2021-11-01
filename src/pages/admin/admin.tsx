import {
  faBookReader,
  faChevronLeft,
  faPlus,
  faRedo,
  faUserPlus,
  faUsersCog,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { auth } from "../../firebase";
import Styles from "./admin.module.scss";
import ActionCard from "./components/actionCard/actionCard";
import CoursePanel from "./components/coursePanel/coursePanel";
import ModeratorPanel from "./components/moderatorPanel/moderatorPanel";

function Admin() {
  const [panel, setPanel] = useState("main");
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
        {panel === "moderator" && "There are currently 4 moderators"}
        {panel === "course" &&
          "Course list has 45 courses and was last modified on October 31, 2021 at 10:47 AM"}
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
