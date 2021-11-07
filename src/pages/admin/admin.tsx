import {
  faBookReader,
  faChevronLeft,
  faHome,
  faUsersCog,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import {
  ActionButton,
  LinkButton,
} from "../../components/buttonWithIcon/buttonWithIcon";
import { auth } from "../../firebase";
import Styles from "./admin.module.scss";
import ActionCard from "./components/actionCard/actionCard";
import CoursePanel from "./components/coursePanel/coursePanel";
import ModeratorPanel from "./components/moderatorPanel/moderatorPanel";

function Admin() {
  const [panel, setPanel] = useState("main");
  return (
    <div className={Styles.body}>
      <div className={Styles.buttonGroup}>
        {panel !== "main" ? (
          <ActionButton
            action={() => setPanel("main")}
            icon={faChevronLeft}
            text="Admin panel"
          />
        ) : (
          <LinkButton link="/" icon={faHome} text="Home" />
        )}
      </div>
      {panel === "main" && (
        <>
          <span className={Styles.headerText}>
            Welcome, {auth.currentUser?.displayName}!
          </span>
          <span className={Styles.headerSubText}>
            What would you like to do today?
          </span>
        </>
      )}
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
