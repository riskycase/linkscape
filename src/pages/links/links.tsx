import {
  faChevronLeft,
  faChevronRight,
  faExternalLinkAlt,
  faFlag,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Link } from "react-router-dom";
import UIkit from "uikit";
import { allCourses, getLinksForCourse, reportLink } from "../../firebase";
import Styles from "./links.module.scss";

function isCourseInFilter(course: Course, filter: string) {
  return (
    course.code.toLowerCase().indexOf(filter.toLowerCase()) + 1 ||
    course.title.toLowerCase().indexOf(filter.toLowerCase()) + 1
  );
}

function Links() {
  const [selectedCourse, selectCourse] = useState(-1);
  const [courses, setCourses] = useState<Course[]>([]);
  const [filter, setFilter] = useState("");
  const [courseLinks, setCourseLinks] = useState<
    Array<{ id: string; link: LinkObject }>
  >([]);
  const [activeLink, setActiveLink] = useState<{
    id: string;
    link: LinkObject;
  } | null>(null);
  allCourses.then(setCourses);
  return (
    <div className={Styles.linksPage}>
      <Link to="/">
        <button
          className={`uk-button uk-button-primary uk-button-small ${Styles.backButton}`}
        >
          <FontAwesomeIcon icon={faChevronLeft} className={Styles.buttonIcon} />
          <span className={Styles.buttonText}>Back to home</span>
        </button>
      </Link>
      {selectedCourse === -1 ? (
        <>
          <div className={`uk-inline ${Styles.filterInput}`}>
            <FontAwesomeIcon icon={faSearch} className={Styles.filterIcon} />
            <input
              className={`uk-input uk-form-blank ${Styles.filterTextBox}`}
              type="text"
              placeholder="Code or Title"
              id="filterInput"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
            />
          </div>
          <table className={`uk-table uk-table-divider ${Styles.courseTable}`}>
            <thead>
              <tr>
                <th className="uk-text-nowrap">Course code</th>
                <th className="uk-width-expand">Title</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, index) => (
                <tr
                  key={index}
                  hidden={!isCourseInFilter(course, filter)}
                  onClick={() => {
                    selectCourse(index);
                    getLinksForCourse(courses[index].code).then(setCourseLinks);
                  }}
                >
                  <td>{course.code.replaceAll("/", "/ ")}</td>
                  <td className="uk-width-expand">{course.title}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : activeLink ? (
        <div className={Styles.linkPanel}>
          <button
            className={`uk-button uk-button-primary uk-button-small ${Styles.button}`}
            onClick={() => {
              setActiveLink(null);
            }}
          >
            <FontAwesomeIcon
              icon={faChevronLeft}
              className={Styles.buttonIcon}
            />
            <span className={Styles.buttonText}>Course page</span>
          </button>
          <div className={Styles.keyValue}>
            <span className={Styles.key}>Title</span>
            <span className={`uk-text-break ${Styles.value}`}>
              {activeLink.link.title}
            </span>
          </div>
          <div className={Styles.keyValue}>
            <span className={Styles.key}>Link</span>
            <span className={`uk-text-break ${Styles.value}`}>
              {activeLink.link.link}
            </span>
          </div>
          <div className={Styles.keyValue}>
            <span className={Styles.key}>Shared by</span>
            <span className={`uk-text-break ${Styles.value}`}>
              <Link to={`/profile?uid=${activeLink.link.owner.uid}`}>
                {activeLink.link.owner.name}
              </Link>
            </span>
          </div>
          <div className={Styles.buttonGroup}>
            <button
              className={`uk-button uk-button-primary uk-button-small ${Styles.button}`}
              onClick={() => {
                UIkit.modal
                  .prompt("Enter reason for reporting", "")
                  .then((reason) => reportLink(activeLink, reason || ""))
                  .then(() => console.log("fone"))
                  .catch(console.error);
              }}
            >
              <FontAwesomeIcon icon={faFlag} className={Styles.buttonIcon} />
              <span className={Styles.buttonText}>Report</span>
            </button>
            <button
              className={`uk-button uk-button-primary uk-button-small ${Styles.button}`}
              onClick={() => {
                let link = activeLink.link.link;
                if (!link.startsWith("http")) link = "http://" + link;
                window.open(link, "_blank");
              }}
            >
              <FontAwesomeIcon
                icon={faExternalLinkAlt}
                className={Styles.buttonIcon}
              />
              <span className={Styles.buttonText}>Open</span>
            </button>
          </div>
        </div>
      ) : (
        <div className={Styles.coursePanel}>
          <button
            className={`uk-button uk-button-primary uk-button-small ${Styles.button}`}
            onClick={() => {
              selectCourse(-1);
              setCourseLinks([]);
            }}
          >
            <FontAwesomeIcon
              icon={faChevronLeft}
              className={Styles.buttonIcon}
            />
            <span className={Styles.buttonText}>Select a different course</span>
          </button>
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
