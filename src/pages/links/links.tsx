import { faChevronLeft, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Link } from "react-router-dom";
import { allCourses, getLinksForCourse } from "../../firebase";
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
  allCourses.then(setCourses);
  console.log(courseLinks);
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
                <div className={Styles.linkDiv} key={courseLink.id}>
                  <a href={courseLink.link.link} className={Styles.owner}>
                    <div className="uk-panel uk-text-wrap uk-text-break">
                      {courseLink.link.title}
                    </div>
                  </a>
                  <span className={Styles.owner}>
                    shared by{" "}
                    <Link to={`/profile/${courseLink.link.owner.uid}`}>
                      {courseLink.link.owner.name}
                    </Link>
                  </span>
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
