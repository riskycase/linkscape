import { faSearch } from "@fortawesome/free-solid-svg-icons";
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
    <>
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
      <table className={`uk-table ${Styles.courseTable}`}>
        <thead>
          <tr className={Styles.tableRow}>
            <th className={`uk-text-nowrap ${Styles.tableHeading}`}>
              Course code
            </th>
            <th className={`uk-width-expand ${Styles.tableHeading}`}>Title</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course, index) =>
            isCourseInFilter(course, filter) ? (
              <tr
                key={index}
                className={Styles.tableRow}
                onClick={() => {
                  setCourse && setCourse(courses[index]);
                  setIndex && setIndex(index);
                }}
              >
                <td>{course.code.replaceAll("/", "/ ")}</td>
                <td className="uk-width-expand">{course.title}</td>
              </tr>
            ) : (
              <></>
            )
          )}
        </tbody>
      </table>
    </>
  );
}

export default CourseTable;
