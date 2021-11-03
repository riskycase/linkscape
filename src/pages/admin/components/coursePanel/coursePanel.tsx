import { deepEqual } from "@firebase/util";
import { faPlus, faRedo, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { allCourses, getAllCourses } from "../../../../firebase";
import Styles from "./coursePanel.module.scss";

function CoursePanel() {
  const [courses, setCourses] = useState<Array<Course>>([]);
  const [filter, setFilter] = useState("");
  allCourses.then((upstreamCourses) => {
    if (!deepEqual(courses, upstreamCourses)) setCourses(upstreamCourses);
  });
  return (
    <div className={Styles.coursePanel}>
      <div className={Styles.buttonGroup}>
        <button
          className={`uk-button uk-button-primary uk-button-small ${Styles.button}`}
        >
          <FontAwesomeIcon icon={faPlus} className={Styles.buttonIcon} />
          <span className={Styles.buttonText}>Add a course</span>
        </button>
        <button
          className={`uk-button uk-button-primary uk-button-small ${Styles.button}`}
          onClick={() => getAllCourses().then(setCourses)}
        >
          <FontAwesomeIcon icon={faRedo} className={Styles.buttonIcon} />
          <span className={Styles.buttonText}>Refresh course list</span>
        </button>
      </div>
      <div className={`uk-inline ${Styles.filterInput}`}>
        <FontAwesomeIcon icon={faSearch} className={Styles.filterIcon} />
        <input
          className={`uk-input uk-form-blank ${Styles.filterTextBox}`}
          type="text"
          placeholder="Code or Title"
          id="filterInput"
          onChange={(event) => setFilter(event.target.value.toLowerCase())}
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
            <tr key={index} hidden={!isCourseInFilter(course, filter)}>
              <td>{course.code.replaceAll("/", "/ ")}</td>
              <td className="uk-width-expand">{course.title}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CoursePanel;
function isCourseInFilter(course: Course, filter: string) {
  return (
    course.code.toLowerCase().indexOf(filter.toLowerCase()) + 1 ||
    course.title.toLowerCase().indexOf(filter.toLowerCase()) + 1
  );
}
