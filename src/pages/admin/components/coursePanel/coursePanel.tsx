import { faPlus, faRedo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Styles from "./coursePanel.module.scss";

function CoursePanel() {
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
        >
          <FontAwesomeIcon icon={faRedo} className={Styles.buttonIcon} />
          <span className={Styles.buttonText}>Refresh course list</span>
        </button>
      </div>
    </div>
  );
}

export default CoursePanel;
