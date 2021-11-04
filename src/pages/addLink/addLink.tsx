import {
  faChevronLeft,
  faPlus,
  faSearch,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Link } from "react-router-dom";
import { allCourses, auth } from "../../firebase";
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
                    setLink({
                      link: "",
                      title: "",
                      owner: {
                        uid: auth.currentUser!!.uid,
                        name: auth.currentUser!!.displayName!!,
                      },
                      course: courses[index].code,
                      reports: {},
                    });
                  }}
                >
                  <td>{course.code.replaceAll("/", "/ ")}</td>
                  <td className="uk-width-expand">{course.title}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <>
          <div className={Styles.addLinkPanel}>
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
                    course: link.course,
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
                    course: link.course,
                    reports: link.reports,
                  });
                }}
              />
            </div>
            <div className={Styles.buttonGroup}>
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
              <button
                className={`uk-button uk-button-primary uk-button-small ${Styles.buttonCancel}`}
                onClick={() => {
                  console.log(link);
                  setTimeout(() => {
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
                  }, 3000);
                }}
              >
                <FontAwesomeIcon icon={faPlus} className={Styles.buttonIcon} />
                <span className={Styles.buttonText}>Add</span>
              </button>
            </div>
            <div className={Styles.linkPreview}>
              <span className={Styles.previewHeading}>Link preview:</span>
              {link.link === "" ? (
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
