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
      <div className={`uk-inline ${Styles.filterInput}`}>
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
                setCourse && setCourse(courses[index]);
                setIndex && setIndex(index);
              }}
            >
              <td>{course.code.replaceAll("/", "/ ")}</td>
              <td className="uk-width-expand">{course.title}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default CourseTable;
