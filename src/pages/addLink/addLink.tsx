import {
  faChevronLeft,
  faPlus,
  faSearch,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Link } from "react-router-dom";
import CourseTable from "../../components/courseTable/courseTable";
import { addNewLink, allCourses, auth } from "../../firebase";
import Styles from "./addLinks.module.scss";

function isCourseInFilter(course: Course, filter: string) {
  return (
    course.code.toLowerCase().indexOf(filter.toLowerCase()) + 1 ||
    course.title.toLowerCase().indexOf(filter.toLowerCase()) + 1
  );
}

function AddLink() {
  const [selectedCourse, selectCourse] = useState(-1);
  const [courses, setCourses] = useState<Course[]>([]);
  const [filter, setFilter] = useState("");
  const [link, setLink] = useState<LinkObject>({
    link: "",
    title: "",
    owner: {
      uid: auth.currentUser!!.uid,
      name: auth.currentUser!!.displayName!!,
    },
    course: "",
    reports: {},
  });
  allCourses.then(setCourses);
  return (
    <div className={Styles.addLinkPage}>
      {selectedCourse === -1 ? (
        <>
          <Link to="/">
            <button
              className={`uk-button uk-button-primary uk-button-small ${Styles.backButton}`}
            >
              <FontAwesomeIcon
                icon={faChevronLeft}
                className={Styles.buttonIcon}
              />
              <span className={Styles.buttonText}>Back to home</span>
            </button>
          </Link>
          <CourseTable courses={courses} setIndex={selectCourse} />
        </>
      ) : (
        <>
          <div className={Styles.addLinkPanel}>
            <button
              className={`uk-button uk-button-danger uk-button-small ${Styles.buttonCancel}`}
              onClick={() => {
                selectCourse(-1);
                setFilter("");
                setLink({
                  link: "",
                  title: "",
                  owner: {
                    uid: auth.currentUser!!.uid,
                    name: auth.currentUser!!.displayName!!,
                  },
                  course: "",
                  reports: {},
                });
              }}
            >
              <FontAwesomeIcon icon={faTimes} className={Styles.buttonIcon} />
              <span className={Styles.buttonText}>Cancel</span>
            </button>
            <span className={Styles.subHeading}>
              Adding a link for {courses[selectedCourse].code} -{" "}
              {courses[selectedCourse].title}
            </span>
            <div>
              <label htmlFor="linkTitle">Title</label>
              <input
                className="uk-input"
                id="linkTitle"
                value={link.title}
                onChange={(event) => {
                  setLink({
                    link: link.link,
                    title: event.target.value,
                    owner: link.owner,
                    course: courses[selectedCourse].code,
                    reports: link.reports,
                  });
                }}
              />
            </div>
            <div>
              <label htmlFor="linkLink">Link</label>
              <input
                className="uk-input"
                id="linkTitle"
                value={link.link}
                onChange={(event) => {
                  setLink({
                    link: event.target.value,
                    title: link.title,
                    owner: link.owner,
                    course: courses[selectedCourse].code,
                    reports: link.reports,
                  });
                }}
              />
            </div>
            <button
              className={`uk-button uk-button-primary uk-button-small ${Styles.buttonAdd}`}
              onClick={() => {
                addNewLink(link).then(() => {
                  selectCourse(-1);
                  setFilter("");
                  setLink({
                    link: "",
                    title: "",
                    owner: {
                      uid: auth.currentUser!!.uid,
                      name: auth.currentUser!!.displayName!!,
                    },
                    course: "",
                    reports: {},
                  });
                });
              }}
            >
              <FontAwesomeIcon icon={faPlus} className={Styles.buttonIcon} />
              <span className={Styles.buttonText}>Add</span>
            </button>
            <div className={Styles.linkPreview}>
              <span className={Styles.previewHeading}>Link preview:</span>
              {link.link === "" || link.title === "" ? (
                <span className="uk-text-muted">Enter a link first!</span>
              ) : (
                <div className={Styles.linkDiv}>
                  <a href={link.link} className={Styles.owner}>
                    <div className="uk-panel uk-text-wrap uk-text-break">
                      {link.title}
                    </div>
                  </a>
                  <span className={Styles.owner}>
                    shared by{" "}
                    <Link to={`/profile/${link.owner.uid}`}>
                      {link.owner.name}
                    </Link>
                  </span>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AddLink;
