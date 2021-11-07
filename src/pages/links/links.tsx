import { faHome } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { LinkButton } from "../../components/buttonWithIcon/buttonWithIcon";
import CourseTable from "../../components/courseTable/courseTable";
import { allCourses } from "../../firebase";
import CoursePanel from "./components/coursePanel/coursePanel";
import Styles from "./links.module.scss";

function Links() {
  const [selectedCourse, selectCourse] = useState(-1);
  const [courses, setCourses] = useState<Course[]>([]);
  allCourses.then(setCourses).then(() => {
    const URLObject = new URL(window.location.href);
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
      {selectedCourse === -1 ? (
        <>
          <LinkButton link="/" icon={faHome} text="Home" />
          <CourseTable courses={courses} setIndex={selectCourse} />
        </>
      ) : (
        <CoursePanel
          course={courses[selectedCourse]}
          returnFunction={() => selectCourse(-1)}
        />
      )}
    </div>
  );
}

export default Links;
