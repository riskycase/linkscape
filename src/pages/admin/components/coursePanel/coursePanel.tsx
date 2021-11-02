import { deepEqual } from "@firebase/util";
import { faPlus, faRedo, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { getAllCourses } from "../../../../firebase";
import Styles from "./coursePanel.module.scss";

function CoursePanel() {
  const [courses, setCourses] = useState<Array<Course>>([]);
  getAllCourses().then((upstreamCourses) => {
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
          onChange={(event) => {
            const value = event.target.value.toLowerCase();
            console.log(value);
            console.log(
              courses.filter(
                (course) =>
                  course.code.toLowerCase().indexOf(value) + 1 ||
                  course.title.toLowerCase().indexOf(value) + 1
              )
            );
          }}
        />
      </div>
    </div>
  );
}

export default CoursePanel;
