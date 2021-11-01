import { faUserPlus, faRedo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Styles from "./moderatorPanel.module.scss";

function ModeratorPanel() {
  return (
    <div className={Styles.moderatorPanel}>
      <div className={Styles.buttonGroup}>
        <button
          className={`uk-button uk-button-primary uk-button-small ${Styles.button}`}
        >
          <FontAwesomeIcon icon={faUserPlus} className={Styles.buttonIcon} />
          <span className={Styles.buttonText}>Add a moderator</span>
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

export default ModeratorPanel;
