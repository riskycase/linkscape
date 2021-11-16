import { deepEqual } from "@firebase/util";
import {
  faChevronLeft,
  faFlag,
  faExternalLinkAlt,
  faChevronRight,
  faPlus,
  faShare,
  faTimes,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import UIkit from "uikit";
import { ActionButton } from "../../../../components/buttonWithIcon/buttonWithIcon";
import LinkDiv from "../../../../components/linkDiv/linkDiv";
import {
  addNewLink,
  auth,
  deleteLink,
  getLinksForCourse,
  reportLink,
} from "../../../../firebase";
import Styles from "./coursePanel.module.scss";

function CoursePanel({
  course,
  returnFunction,
}: {
  course: Course;
  returnFunction: Function;
}) {
  let history = useHistory();
  const URLObject = new URL(window.location.href);
  const [courseLinks, setCourseLinks] = useState<Array<LinkWithKey>>([]);
  const [activeLink, setActiveLink] = useState<LinkWithKey | null>(null);
  const [mode, setMode] = useState("view");
  const [link, setLink] = useState<LinkObject>({
    link: "",
    title: "",
    owner: {
      uid: "",
      name: "",
    },
    course: "",
  });
  if (auth.currentUser) {
    const linkObject: LinkObject = {
      link: link.link,
      title: link.title,
      owner: {
        uid: auth.currentUser.uid,
        name: auth.currentUser.displayName!!,
      },
      course: course.code,
    };
    if (!deepEqual(link, linkObject)) setLink(linkObject);
  }
  getLinksForCourse(course.code).then((upstreamLinks) => {
    if (!deepEqual(upstreamLinks, courseLinks)) setCourseLinks(upstreamLinks);
    if (URLObject.searchParams.has("link"))
      setActiveLink(
        courseLinks.find(
          (link) => link.id === URLObject.searchParams.get("link")
        ) || null
      );
  });
  return mode === "view" ? (
    activeLink ? (
      <div className={Styles.linkPanel}>
        <ActionButton
          action={() => {
            URLObject.searchParams.delete("link");
            history.push("/links?" + URLObject.searchParams.toString());
            setActiveLink(null);
          }}
          icon={faChevronLeft}
          text="Course page"
        />
        <LinkDiv link={activeLink} />
        <div className={Styles.buttonGroup}>
          {auth.currentUser &&
            (auth.currentUser.uid !== activeLink.link.owner.uid ? (
              <ActionButton
                action={() => {
                  UIkit.modal
                    .prompt("Enter reason for reporting", "")
                    .then((reason) => reportLink(activeLink, reason || ""))
                    .then(() =>
                      UIkit.notification({
                        message: "Reported successfully",
                        status: "success",
                        timeout: 1500,
                      })
                    )
                    .catch((reason) => {
                      if (reason === "already-reported")
                        UIkit.notification({
                          message: "You have already reported this link",
                          status: "danger",
                          timeout: 1500,
                        });
                    });
                }}
                icon={faFlag}
                text="Report"
              />
            ) : (
              <ActionButton
                icon={faTrash}
                text="Delete"
                action={() => {
                  deleteLink(
                    `${course.code}/${activeLink.id}`,
                    auth.currentUser!!.uid
                  )
                    .then(() => getLinksForCourse(course.code))
                    .then((upstreamLinks) => {
                      URLObject.searchParams.delete("link");
                      history.push(
                        "/links?" + URLObject.searchParams.toString()
                      );
                      setCourseLinks(upstreamLinks);
                      setActiveLink(null);
                    });
                }}
              />
            ))}
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
        <div className={Styles.buttonGroup}>
          {auth.currentUser && (
            <ActionButton
              action={() => setMode("add")}
              icon={faPlus}
              text="Add link"
            />
          )}
          <ActionButton
            action={() => {
              navigator.clipboard.writeText(window.location.href).then(() => {
                UIkit.notification("Course page URL copied to clipboard", {
                  status: "success",
                  timeout: 1500,
                });
              });
            }}
            icon={faShare}
            text="Share Page"
          />
        </div>
        {courseLinks.length ? (
          <div className={Styles.linksList}>
            {courseLinks.map((courseLink) => (
              <div
                className={Styles.linkDiv}
                key={courseLink.id}
                onClick={() => {
                  URLObject.searchParams.set("link", courseLink.id);
                  history.push("/links?" + URLObject.searchParams.toString());
                }}
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
        {!auth.currentUser && (
          <span className={Styles.signInHint}>Sign in to add links</span>
        )}
      </div>
    )
  ) : (
    <div className={Styles.addLinkPanel}>
      <span className={Styles.subHeading}>
        Adding a link for {course.code} - {course.title}
      </span>
      <div className={Styles.inputGroup}>
        <label htmlFor="linkTitle" className={Styles.inputLabel}>
          Title
        </label>
        <input
          className={`uk-input ${Styles.input}`}
          id="linkTitle"
          value={link.title}
          onChange={(event) => {
            setLink({
              link: link.link,
              title: event.target.value,
              owner: link.owner,
              course: course.code,
            });
          }}
        />
      </div>
      <div className={Styles.inputGroup}>
        <label htmlFor="linkLink" className={Styles.inputLabel}>
          Link
        </label>
        <input
          className={`uk-input ${Styles.input}`}
          id="linkTitle"
          value={link.link}
          onChange={(event) => {
            setLink({
              link: event.target.value,
              title: link.title,
              owner: link.owner,
              course: course.code,
            });
          }}
        />
      </div>
      <div className={Styles.buttonGroup}>
        <ActionButton
          action={() => {
            setLink({
              link: "",
              title: "",
              owner: {
                uid: "",
                name: "",
              },
              course: "",
            });
            setMode("view");
          }}
          icon={faTimes}
          text="Cancel"
        />
        <ActionButton
          action={() => {
            setLink({
              link: link.link,
              title: link.title,
              owner: {
                uid: auth.currentUser!!.uid,
                name: auth.currentUser!!.displayName!!,
              },
              course: course.code,
            });
            addNewLink(link).then(() => {
              setLink({
                link: "",
                title: "",
                owner: {
                  uid: "",
                  name: "",
                },
                course: "",
              });
              setMode("view");
            });
          }}
          icon={faPlus}
          text="Add"
        />
      </div>
      <div className={Styles.linkPreview}>
        <span className={Styles.previewHeading}>Link preview:</span>
        {link.link === "" || link.title === "" ? (
          <span className="uk-text-muted">Enter a link first!</span>
        ) : (
          <LinkDiv link={{ id: "", link }} />
        )}
      </div>
    </div>
  );
}

export default CoursePanel;
