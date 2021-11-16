import { faChevronRight, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import Styles from "./courseTable.module.scss";

function isCourseInFilter(course: Course, filter: string) {
  return (
    course.code.toLowerCase().indexOf(filter.toLowerCase()) + 1 ||
    course.title.toLowerCase().indexOf(filter.toLowerCase()) + 1
  );
}

function CourseTable({
  courses,
  setIndex,
  setCourse,
}: {
  courses: Course[];
  setIndex?: Function;
  setCourse?: Function;
}) {
  const [filter, setFilter] = useState("");
  return (
    <div className={Styles.container}>
      <div className={Styles.filterContainer}>
        <div className={`uk-inline  uk-border-pill ${Styles.filterInput}`}>
          <FontAwesomeIcon icon={faSearch} className={Styles.filterIcon} />
          <input
            className={`uk-input uk-form-blank ${Styles.filterTextBox}`}
            type="text"
            placeholder="Code or Title"
            id="filterInput"
            defaultValue={filter}
            onChange={(event) => setFilter(event.target.value)}
          />
        </div>
      </div>
      <div className={Styles.courseList}>
        {courses.map((course, index) =>
          isCourseInFilter(course, filter) ? (
            <div
              key={index}
              className={Styles.coursePanel}
              onClick={() => {
                setCourse && setCourse(courses[index]);
                setIndex && setIndex(index);
              }}
            >
              <div className={Styles.courseTexts}>
                <span className={Styles.courseCode}>
                  {course.code.replaceAll("/", "/ ")}
                </span>
                <span className={Styles.courseTitle}>{course.title}</span>
              </div>
              <FontAwesomeIcon icon={faChevronRight} />
            </div>
          ) : (
            <></>
          )
        )}
      </div>
    </div>
  );
}

export default CourseTable;
