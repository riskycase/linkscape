import { useState } from "react";
import { useHistory } from "react-router";
import CourseTable from "../../components/courseTable/courseTable";
import { allCourses } from "../../firebase";
import CoursePanel from "./components/coursePanel/coursePanel";
import Styles from "./links.module.scss";

function Links() {
  const history = useHistory();
  const [selectedCourse, selectCourse] = useState(-1);
  const [courses, setCourses] = useState<Course[]>([]);
  const URLObject = new URL(window.location.href);
  allCourses.then(setCourses).then(() => {
    if (URLObject.searchParams.has("course"))
      selectCourse(
        courses.findIndex(
          (course) =>
            course.code.toLowerCase() ===
            new URL(window.location.href).searchParams
              .get("course")
              ?.toLowerCase()
        )
      );
  });
  return (
    <div className={Styles.linksPage}>
      <div
        className={`${Styles.linksPageContainer} ${
          selectedCourse !== -1 ? Styles.hidden : ""
        }`}
      >
        <div className={Styles.innerContainer}>
          <CourseTable
            courses={courses}
            setIndex={(index: number) => {
              URLObject.searchParams.set("course", courses[index].code);
              history.push("/links?" + URLObject.searchParams.toString());
            }}
          />
        </div>
      </div>
      <div
        className={`${Styles.linksPageContainer} ${
          selectedCourse === -1 ? Styles.hidden : ""
        }`}
      >
        <div className={Styles.innerContainer}>
          {selectedCourse !== -1 && (
            <CoursePanel
              course={courses[selectedCourse]}
              returnFunction={() => selectCourse(-1)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Links;
