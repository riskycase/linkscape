import { deepEqual } from "@firebase/util";
import {
  faUserPlus,
  faRedo,
  faChevronLeft,
  faSearch,
  faTimes,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import UIkit from "uikit";
import {
  getModerators,
  getUserByMail,
  moderatorPromise,
} from "../../../../firebase";
import Styles from "./moderatorPanel.module.scss";

function ModeratorPanel() {
  const [activeState, setActiveState] = useState("main");
  const [moderators, setModerators] = useState<User[]>([]);
  const [email, setEmail] = useState("");
  const [newModerator, setNewModerator] = useState<User | null>(null);
  const [addModeratorState, setAddModeratorState] = useState("none");
  moderatorPromise.then((upstreamModerators) => {
    if (!deepEqual(moderators, upstreamModerators))
      setModerators(upstreamModerators);
  });
  function searchModerator() {
    setAddModeratorState("searching");
    getUserByMail(email)
      .then((newMod) => {
        setAddModeratorState("found");
        setNewModerator(newMod);
      })
      .catch((err) => {
        if (err === "not-exist") setAddModeratorState("not-found");
        else setAddModeratorState("error");
      });
  }
  console.log(newModerator);
  return (
    <div className={Styles.moderatorPanel}>
      <div className={Styles.buttonGroup}>
        {activeState === "main" ? (
          <>
            <button
              className={`uk-button uk-button-primary uk-button-small ${Styles.button}`}
              onClick={() => setActiveState("add")}
            >
              <FontAwesomeIcon
                icon={faUserPlus}
                className={Styles.buttonIcon}
              />
              <span className={Styles.buttonText}>Add a moderator</span>
            </button>
            <button
              className={`uk-button uk-button-primary uk-button-small ${Styles.button}`}
              onClick={() => getModerators().then(setModerators)}
            >
              <FontAwesomeIcon icon={faRedo} className={Styles.buttonIcon} />
              <span className={Styles.buttonText}>Refresh moderator list</span>
            </button>
          </>
        ) : (
          <>
            <button
              className={`uk-button uk-button-primary uk-button-small ${Styles.button}`}
              onClick={() => setActiveState("main")}
            >
              <FontAwesomeIcon
                icon={faChevronLeft}
                className={Styles.buttonIcon}
              />
              <span className={Styles.buttonText}>Back to moderator panel</span>
            </button>
          </>
        )}
      </div>
      {activeState === "main" ? (
        <table className={`uk-table ${Styles.moderatorTable}`}>
          <thead>
            <tr>
              <th className="uk-table-shrink"></th>
              <th className="uk-table-expand">Name</th>
              <th className="uk-table-shrink"></th>
            </tr>
          </thead>
          <tbody>
            {moderators.map((moderator, index) => (
              <tr key={index}>
                <td>
                  <img
                    className={`uk-preserve-width ${Styles.moderatorPicture}`}
                    src={moderator.profilePhoto}
                    alt={moderator.name}
                  />
                </td>
                <td>{moderator.name}</td>
                <td>
                  <button
                    className={`uk-button uk-button-small uk-button-danger`}
                    onClick={() => {
                      UIkit.modal.confirm(
                        `Dismiss ${moderator.name} from the position of moderator?`
                      );
                    }}
                  >
                    Dismiss
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <>
          <div className={Styles.searchContainer}>
            <input
              className="uk-input"
              id="userSearch"
              placeholder="Complete email address"
              onChange={(event) => setEmail(event.target.value)}
              onKeyUp={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  searchModerator();
                }
              }}
            />
            <FontAwesomeIcon icon={faSearch} onClick={searchModerator} />
          </div>
          {!(addModeratorState === "none" || addModeratorState === "found") && (
            <div uk-alert>
              {addModeratorState === "searching"
                ? "Querying database for user"
                : addModeratorState === "not-found"
                ? "There's no user with that email id!"
                : ""}
            </div>
          )}
          {newModerator && (
            <div className={Styles.newModeratorPreview}>
              <span>Make {newModerator.name} a moderator?</span>
              <div className={Styles.newModeratorPersonalDetails}>
                <img
                  className={`uk-preserve-width ${Styles.newModeratorPicture}`}
                  src={newModerator.profilePhoto}
                  alt={newModerator.name}
                />
                <div className={Styles.newModeratorNameEmail}>
                  <span>{newModerator.name}</span>
                  <span>{newModerator.emailId}</span>
                </div>
              </div>
              <div className={Styles.actionButtonGroup}>
                <button
                  className={`uk-button uk-button-danger uk-button-small ${Styles.buttonCancel}`}
                  onClick={() => {
                    setActiveState("main");
                    setAddModeratorState("none");
                    setNewModerator(null);
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
                  onClick={() => {}}
                >
                  <FontAwesomeIcon
                    icon={faCheck}
                    className={Styles.buttonIcon}
                  />
                  <span className={Styles.buttonText}>Yes</span>
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ModeratorPanel;
