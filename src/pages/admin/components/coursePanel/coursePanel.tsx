import { deepEqual } from "@firebase/util";
import {
  faChevronLeft,
  faEdit,
  faPlus,
  faRedo,
  faSave,
  faSearch,
  faTimes,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import UIkit from "uikit";
import { allCourses, getAllCourses } from "../../../../firebase";
import Styles from "./coursePanel.module.scss";

function CoursePanel() {
  const [courses, setCourses] = useState<Array<Course>>([]);
  const [filter, setFilter] = useState("");
  const [activeState, setActiveState] = useState("main");
  const [selectedCourse, selectCourse] = useState(-1);
  const [loading, setLoading] = useState(false);
  allCourses.then((upstreamCourses) => {
    if (!deepEqual(courses, upstreamCourses)) setCourses(upstreamCourses);
  });
  return (
    <div className={Styles.coursePanel}>
      <div className={Styles.buttonGroup}>
        {activeState === "main" ? (
          <>
            <button
              className={`uk-button uk-button-primary uk-button-small ${Styles.button}`}
              onClick={() => setActiveState("add")}
            >
              <FontAwesomeIcon icon={faPlus} className={Styles.buttonIcon} />
              <span className={Styles.buttonText}>Add a course</span>
            </button>
            <button
              className={`uk-button uk-button-primary uk-button-small ${Styles.button}`}
              onClick={() => setActiveState("edit")}
            >
              <FontAwesomeIcon icon={faEdit} className={Styles.buttonIcon} />
              <span className={Styles.buttonText}>Edit a course</span>
            </button>
            <button
              className={`uk-button uk-button-primary uk-button-small ${Styles.button}`}
              onClick={() => setActiveState("delete")}
            >
              <FontAwesomeIcon icon={faTrash} className={Styles.buttonIcon} />
              <span className={Styles.buttonText}>Delete a course</span>
            </button>
            <button
              className={`uk-button uk-button-primary uk-button-small ${Styles.button}`}
              onClick={() => getAllCourses().then(setCourses)}
            >
              <FontAwesomeIcon icon={faRedo} className={Styles.buttonIcon} />
              <span className={Styles.buttonText}>Refresh course list</span>
            </button>
          </>
        ) : (
          <button
            className={`uk-button uk-button-primary uk-button-small ${Styles.button}`}
            onClick={() => {
              setActiveState("main");
              setFilter("");
              selectCourse(-1);
            }}
          >
            <FontAwesomeIcon
              icon={faChevronLeft}
              className={Styles.buttonIcon}
            />
            <span className={Styles.buttonText}>Back to course panel</span>
          </button>
        )}
      </div>
      {activeState !== "main" && (
        <>
          <label htmlFor="filterInput">
            {activeState === "add"
              ? "Enter details of course to add"
              : `Select course to ${activeState}`}
          </label>
          {activeState === "add" && (
            <>
              <form className={`uikit-form ${Styles.editForm}`}>
                <div>
                  <label htmlFor="courseCode">Course code</label>
                  <input className="uk-input" id="courseCode" />
                </div>
                <div>
                  <label htmlFor="courseTitle">Course title</label>
                  <input className="uk-input" id="courseTitle" />
                </div>
              </form>
              <div className={Styles.actionButtonGroup}>
                <button
                  className={`uk-button uk-button-primary uk-button-small ${Styles.buttonCancel}`}
                  onClick={() => {
                    selectCourse(-1);
                    setFilter("");
                    setActiveState("main");
                  }}
                >
                  <FontAwesomeIcon
                    icon={faTimes}
                    className={Styles.buttonIcon}
                  />
                  <span className={Styles.buttonText}>Cancel</span>
                </button>
                <button
                  className={`uk-button uk-button-primary uk-button-small ${Styles.buttonCancel}`}
                  onClick={() => {
                    setLoading(true);
                    setTimeout(() => {
                      // do action
                      setLoading(false);
                      selectCourse(-1);
                      setFilter("");
                      setActiveState("main");
                      UIkit.notification("Done", {
                        status: "success",
                        pos: "bottom-center",
                      });
                    }, 3000);
                  }}
                >
                  <FontAwesomeIcon
                    icon={faPlus}
                    className={Styles.buttonIcon}
                  />
                  <span className={Styles.buttonText}>Add</span>
                </button>
                {loading && <span>Adding subject to database</span>}
              </div>
            </>
          )}
          {(activeState === "delete" || activeState === "edit") &&
            (selectedCourse === -1 ? (
              <>
                <div className={`uk-inline ${Styles.filterInput}`}>
                  <FontAwesomeIcon
                    icon={faSearch}
                    className={Styles.filterIcon}
                  />
                  <input
                    className={`uk-input uk-form-blank ${Styles.filterTextBox}`}
                    type="text"
                    placeholder="Code or Title"
                    id="filterInput"
                    defaultValue={filter}
                    onChange={(event) => setFilter(event.target.value)}
                  />
                </div>
                <table
                  className={`uk-table uk-table-divider ${Styles.courseTable}`}
                >
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
                        onClick={() => selectCourse(index)}
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
                {activeState === "edit" ? (
                  <>
                    <form className={`uikit-form ${Styles.editForm}`}>
                      <div>
                        <label htmlFor="courseCode">Course code</label>
                        <input
                          defaultValue={courses[selectedCourse].code}
                          className="uk-input"
                          id="courseCode"
                        />
                      </div>
                      <div>
                        <label htmlFor="courseTitle">Course title</label>
                        <input
                          defaultValue={courses[selectedCourse].title}
                          className="uk-input"
                          id="courseTitle"
                        />
                      </div>
                    </form>
                  </>
                ) : (
                  <div className="uk-card">
                    <div className="uk-text-large">
                      Are you sure you want to delete{" "}
                      {courses[selectedCourse].code}?
                    </div>
                    <span>
                      {courses[selectedCourse].title} will be removed from the
                      list of courses and all associated links will be deleted
                    </span>
                  </div>
                )}
                <div className={Styles.actionButtonGroup}>
                  <button
                    className={`uk-button uk-button-primary uk-button-small ${Styles.buttonCancel}`}
                    onClick={() => {
                      selectCourse(-1);
                      setFilter("");
                      setActiveState("main");
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faTimes}
                      className={Styles.buttonIcon}
                    />
                    <span className={Styles.buttonText}>Cancel</span>
                  </button>
                  <button
                    className={`uk-button uk-button-primary uk-button-small ${Styles.buttonCancel}`}
                    onClick={() => {
                      setLoading(true);
                      setTimeout(() => {
                        // do action
                        setLoading(false);
                        selectCourse(-1);
                        setFilter("");
                        setActiveState("main");
                        UIkit.notification("Done", {
                          status: "success",
                          pos: "bottom-center",
                        });
                      }, 3000);
                    }}
                  >
                    <FontAwesomeIcon
                      icon={activeState === "edit" ? faSave : faTrash}
                      className={Styles.buttonIcon}
                    />
                    <span className={Styles.buttonText}>
                      {activeState === "edit" ? "Update" : "Delete"}
                    </span>
                  </button>
                  {loading && (
                    <span>
                      {activeState === "edit"
                        ? "Updating subject in database"
                        : "Removing subject from database"}
                    </span>
                  )}
                </div>
              </>
            ))}
        </>
      )}
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
