import { deepEqual } from "@firebase/util";
import {
  faChevronLeft,
  faFlag,
  faExternalLinkAlt,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import UIkit from "uikit";
import { ActionButton } from "../../../../components/buttonWithIcon/buttonWithIcon";
import LinkDiv from "../../../../components/linkDiv/linkDiv";
import { auth, getLinksForCourse, reportLink } from "../../../../firebase";
import Styles from "./coursePanel.module.scss";

function CoursePanel({
  course,
  returnFunction,
}: {
  course: Course;
  returnFunction: Function;
}) {
  let history = useHistory();
  const [courseLinks, setCourseLinks] = useState<Array<LinkWithKey>>([]);
  const [activeLink, setActiveLink] = useState<LinkWithKey | null>(null);
  getLinksForCourse(course.code).then((upstreamLinks) => {
    if (!deepEqual(upstreamLinks, courseLinks)) setCourseLinks(upstreamLinks);
  });
  return activeLink ? (
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
          history.push("/links");
          returnFunction();
        }}
        icon={faChevronLeft}
        text="Select a different course"
      />
      <div className={Styles.courseDetails}>
        <span className={Styles.courseCode}>
          {course.code.replaceAll("/", "/ ")}
        </span>
        <span className={Styles.courseTitle}>{course.title}</span>
      </div>
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
  );
}

export default CoursePanel;
