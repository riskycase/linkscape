import { faHome, faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import {
  ActionButton,
  LinkButton,
} from "../../components/buttonWithIcon/buttonWithIcon";
import CourseTable from "../../components/courseTable/courseTable";
import LinkDiv from "../../components/linkDiv/linkDiv";
import { addNewLink, allCourses, auth } from "../../firebase";
import Styles from "./addLinks.module.scss";

function AddLink() {
  const [selectedCourse, selectCourse] = useState(-1);
  const [courses, setCourses] = useState<Course[]>([]);
  const [link, setLink] = useState<LinkObject>({
    link: "",
    title: "",
    owner: {
      uid: auth.currentUser!!.uid,
      name: auth.currentUser!!.displayName!!,
    },
    course: "",
    reports: {},
  });
  allCourses.then(setCourses);
  return (
    <div className={Styles.addLinkPage}>
      {selectedCourse === -1 ? (
        <>
          <LinkButton link="/" icon={faHome} text="Home" />
          <CourseTable courses={courses} setIndex={selectCourse} />
        </>
      ) : (
        <>
          <div className={Styles.addLinkPanel}>
            <ActionButton
              action={() => {
                selectCourse(-1);
                setLink({
                  link: "",
                  title: "",
                  owner: {
                    uid: auth.currentUser!!.uid,
                    name: auth.currentUser!!.displayName!!,
                  },
                  course: "",
                  reports: {},
                });
              }}
              icon={faTimes}
              text="Cancel"
            />
            <span className={Styles.subHeading}>
              Adding a link for {courses[selectedCourse].code} -{" "}
              {courses[selectedCourse].title}
            </span>
            <div>
              <label htmlFor="linkTitle">Title</label>
              <input
                className="uk-input"
                id="linkTitle"
                value={link.title}
                onChange={(event) => {
                  setLink({
                    link: link.link,
                    title: event.target.value,
                    owner: link.owner,
                    course: courses[selectedCourse].code,
                    reports: link.reports,
                  });
                }}
              />
            </div>
            <div>
              <label htmlFor="linkLink">Link</label>
              <input
                className="uk-input"
                id="linkTitle"
                value={link.link}
                onChange={(event) => {
                  setLink({
                    link: event.target.value,
                    title: link.title,
                    owner: link.owner,
                    course: courses[selectedCourse].code,
                    reports: link.reports,
                  });
                }}
              />
            </div>
            <div className={Styles.buttonGroup}>
              <ActionButton
                action={() => {
                  addNewLink(link).then(() => {
                    selectCourse(-1);
                    setLink({
                      link: "",
                      title: "",
                      owner: {
                        uid: auth.currentUser!!.uid,
                        name: auth.currentUser!!.displayName!!,
                      },
                      course: "",
                      reports: {},
                    });
                  });
                }}
                icon={faPlus}
                text="Add"
              />
            </div>
            <div className={Styles.linkPreview}>
              <span className={Styles.previewHeading}>Link preview:</span>
              {link.link === "" || link.title === "" ? (
                <span className="uk-text-muted">Enter a link first!</span>
              ) : (
                <LinkDiv link={{ id: "", link }} />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AddLink;
