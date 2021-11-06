import { deepEqual } from "@firebase/util";
import {
  faChevronLeft,
  faChevronRight,
  faExternalLinkAlt,
  faFlag,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import UIkit from "uikit";
import {
  ActionButton,
  LinkButton,
} from "../../components/buttonWithIcon/buttonWithIcon";
import CourseTable from "../../components/courseTable/courseTable";
import LinkDiv from "../../components/linkDiv/linkDiv";
import {
  allCourses,
  auth,
  getLinksForCourse,
  reportLink,
} from "../../firebase";
import Styles from "./links.module.scss";

function Links() {
  const [selectedCourse, selectCourse] = useState(-1);
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseLinks, setCourseLinks] = useState<Array<LinkWithKey>>([]);
  const [activeLink, setActiveLink] = useState<LinkWithKey | null>(null);
  allCourses.then(setCourses);
  if (selectedCourse !== -1)
    getLinksForCourse(courses[selectedCourse].code).then((upstreamLinks) => {
      if (!deepEqual(upstreamLinks, courseLinks)) setCourseLinks(upstreamLinks);
    });
  return (
    <div className={Styles.linksPage}>
      {selectedCourse === -1 ? (
        <>
          <LinkButton link="/" icon={faHome} text="Home" />
          <CourseTable courses={courses} setIndex={selectCourse} />
        </>
      ) : activeLink ? (
        <div className={Styles.linkPanel}>
          <ActionButton
            action={() => setActiveLink(null)}
            icon={faChevronLeft}
            text="Course page"
          />
          <LinkDiv link={activeLink} />
          <div className={Styles.buttonGroup}>
            {auth.currentUser && (
              <ActionButton
                action={() => {
                  UIkit.modal
                    .prompt("Enter reason for reporting", "")
                    .then((reason) => reportLink(activeLink, reason || ""))
                    .then(() =>
                      UIkit.notification({
                        message: "Reported successfully",
                        status: "success",
                      })
                    )
                    .catch((reason) => {
                      if (reason === "already-reported")
                        UIkit.notification({
                          message: "You have already reported this link",
                          status: "danger",
                        });
                    });
                }}
                icon={faFlag}
                text="Report"
              />
            )}
            <ActionButton
              action={() => {
                let link = activeLink.link.link;
                if (!link.startsWith("http")) link = "http://" + link;
                window.open(link, "_blank");
              }}
              icon={faExternalLinkAlt}
              text="Open"
            />
          </div>
          {auth.currentUser === null && (
            <span className={Styles.signInHint}>
              Issue with link? Sign in to report it
            </span>
          )}
        </div>
      ) : (
        <div className={Styles.coursePanel}>
          <ActionButton
            action={() => {
              selectCourse(-1);
              setCourseLinks([]);
            }}
            icon={faChevronLeft}
            text="Select a different course"
          />
          <span className={Styles.subHeading}>
            Viewing links for {courses[selectedCourse].code} -{" "}
            {courses[selectedCourse].title}
          </span>
          {courseLinks.length ? (
            <div className={Styles.linksList}>
              {courseLinks.map((courseLink) => (
                <div
                  className={Styles.linkDiv}
                  key={courseLink.id}
                  onClick={() => setActiveLink(courseLink)}
                >
                  <div className="uk-panel uk-text-wrap uk-text-break">
                    {courseLink.link.title}
                  </div>
                  <FontAwesomeIcon icon={faChevronRight} />
                </div>
              ))}
            </div>
          ) : (
            <span>There are no links for this course!</span>
          )}
        </div>
      )}
    </div>
  );
}

export default Links;
