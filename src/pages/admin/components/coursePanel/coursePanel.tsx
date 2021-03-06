import { deepEqual } from "@firebase/util";
import {
  faChevronLeft,
  faEdit,
  faPlus,
  faSave,
  faTimes,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import UIkit from "uikit";
import { ActionButton } from "../../../../components/buttonWithIcon/buttonWithIcon";
import CourseTable from "../../../../components/courseTable/courseTable";
import {
  addNewCourse,
  allCourses,
  deleteCourse,
  editCourse,
  getAllCourses,
} from "../../../../firebase";
import Styles from "./coursePanel.module.scss";

function CoursePanel() {
  const [courses, setCourses] = useState<Array<Course>>([]);
  const [activeState, setActiveState] = useState("main");
  const [selectedCourse, selectCourse] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [newCourse, setNewCourse] = useState<Course>({ code: "", title: "" });
  const [editedCourse, setEditedCourse] = useState<Course>({
    code: "",
    title: "",
  });
  allCourses.then((upstreamCourses) => {
    if (!deepEqual(courses, upstreamCourses)) setCourses(upstreamCourses);
  });
  return (
    <div className={Styles.coursePanel}>
      <span>Course list currently has {courses.length} courses</span>
      <div className={Styles.buttonGroup}>
        {activeState === "main" ? (
          <>
            <ActionButton
              action={() => setActiveState("add")}
              icon={faPlus}
              text="Add a course"
            />
            <ActionButton
              action={() => setActiveState("edit")}
              icon={faEdit}
              text="Edit a course"
            />
            <ActionButton
              action={() => setActiveState("delete")}
              icon={faTrash}
              text="Delete a course"
            />
          </>
        ) : (
          <button
            className={`uk-button uk-button-primary uk-button-small ${Styles.button}`}
            onClick={() => {
              setActiveState("main");
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
                  <input
                    className="uk-input"
                    id="courseCode"
                    value={newCourse.code}
                    onChange={(event) => {
                      setNewCourse({
                        code: event.target.value,
                        title: newCourse.title,
                      });
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="courseTitle">Course title</label>
                  <input
                    className="uk-input"
                    id="courseTitle"
                    value={newCourse.title}
                    onChange={(event) => {
                      setNewCourse({
                        code: newCourse.code,
                        title: event.target.value,
                      });
                    }}
                  />
                </div>
              </form>
              <div className={Styles.actionButtonGroup}>
                <button
                  className={`uk-button uk-button-danger uk-button-small ${Styles.buttonCancel}`}
                  onClick={() => {
                    selectCourse(-1);
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
                    addNewCourse(newCourse).then(() => {
                      setLoading(false);
                      setActiveState("main");
                      UIkit.notification("Added course successfully", {
                        status: "success",
                        pos: "bottom-center",
                      });
                      setNewCourse({ code: "", title: "" });
                      getAllCourses().then(setCourses);
                    });
                  }}
                >
                  <FontAwesomeIcon
                    icon={faPlus}
                    className={Styles.buttonIcon}
                  />
                  <span className={Styles.buttonText}>Add</span>
                </button>
                {loading && <span>Adding course to database</span>}
              </div>
            </>
          )}
          {(activeState === "delete" || activeState === "edit") &&
            (selectedCourse === -1 ? (
              <CourseTable
                courses={courses}
                setIndex={selectCourse}
                setCourse={setEditedCourse}
              />
            ) : (
              <>
                {activeState === "edit" ? (
                  <>
                    <form className={`uikit-form ${Styles.editForm}`}>
                      <div>
                        <label htmlFor="courseCode">Course code</label>
                        <input
                          defaultValue={editedCourse.code}
                          className="uk-input"
                          id="courseCode"
                          onChange={(event) =>
                            setEditedCourse({
                              code: event.target.value,
                              title: editedCourse.title,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label htmlFor="courseTitle">Course title</label>
                        <input
                          defaultValue={editedCourse.title}
                          className="uk-input"
                          id="courseTitle"
                          onChange={(event) =>
                            setEditedCourse({
                              code: editedCourse.code,
                              title: event.target.value,
                            })
                          }
                        />
                      </div>
                    </form>
                  </>
                ) : (
                  <div className="uk-card">
                    <div className="uk-text-large">
                      Are you sure you want to delete {editedCourse.code}?
                    </div>
                    <span>
                      {editedCourse.title} will be removed from the list of
                      courses and all associated links will be deleted
                    </span>
                  </div>
                )}
                <div className={Styles.actionButtonGroup}>
                  <button
                    className={`uk-button uk-button-primary uk-button-small ${Styles.buttonCancel}`}
                    onClick={() => {
                      selectCourse(-1);
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
                      (activeState === "edit"
                        ? editCourse(editedCourse, selectedCourse)
                        : deleteCourse(selectedCourse)
                      ).then(() => {
                        setActiveState("main");
                        setLoading(false);
                        UIkit.notification(
                          `${
                            activeState === "edit" ? "Edited" : "Deleted"
                          } course successfully`,
                          {
                            status: "success",
                            pos: "bottom-center",
                          }
                        );
                        setEditedCourse({ code: "", title: "" });
                        selectCourse(-1);
                        getAllCourses().then(setCourses);
                      });
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
