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
import { ActionButton } from "../../../../components/buttonWithIcon/buttonWithIcon";
import {
  getModerators,
  getUserByMail,
  moderatorPromise,
  updateModeratorStatus,
} from "../../../../firebase";
import Styles from "./moderatorPanel.module.scss";

function ModeratorPanel() {
  const [activeState, setActiveState] = useState("main");
  const [moderators, setModerators] = useState<
    Array<{ user: User; uid: string }>
  >([]);
  const [email, setEmail] = useState("");
  const [newModerator, setNewModerator] = useState<{
    user: User;
    uid: string;
  } | null>(null);
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
  return (
    <div className={Styles.moderatorPanel}>
      <span>
        {moderators.length === 1
          ? "There is currently 1 moderator"
          : `There are currently ${moderators.length} moderators`}
      </span>
      <div className={Styles.buttonGroup}>
        {activeState === "main" ? (
          <>
            <ActionButton
              action={() => setActiveState("add")}
              icon={faUserPlus}
              text="Add a moderator"
            />
            <ActionButton
              action={() => getModerators().then(setModerators)}
              icon={faRedo}
              text="Refresh list"
            />
          </>
        ) : (
          <ActionButton
            action={() => setActiveState("main")}
            icon={faChevronLeft}
            text="Moderator list"
          />
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
                    src={moderator.user.profilePhoto}
                    alt={moderator.user.name}
                  />
                </td>
                <td>{moderator.user.name}</td>
                <td>
                  <button
                    className={`uk-button uk-button-small uk-button-danger`}
                    onClick={() => {
                      UIkit.modal
                        .confirm(
                          `Dismiss ${moderator.user.name} from the position of moderator?`
                        )
                        .then(() => {
                          updateModeratorStatus(moderator.uid, false).then(
                            () => {
                              moderatorPromise.then(setModerators);
                            }
                          );
                        });
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
              <span>Make {newModerator.user.name} a moderator?</span>
              <div className={Styles.newModeratorPersonalDetails}>
                <img
                  className={`uk-preserve-width ${Styles.newModeratorPicture}`}
                  src={newModerator.user.profilePhoto}
                  alt={newModerator.user.name}
                />
                <div className={Styles.newModeratorNameEmail}>
                  <span>{newModerator.user.name}</span>
                  <span>{newModerator.user.emailId}</span>
                </div>
              </div>
              <div className={Styles.actionButtonGroup}>
                <ActionButton
                  action={() => {
                    setActiveState("main");
                    setAddModeratorState("none");
                    setNewModerator(null);
                  }}
                  icon={faTimes}
                  text="Cancel"
                />
                <ActionButton
                  action={() => {
                    updateModeratorStatus(newModerator.uid, true).then(() => {
                      setActiveState("main");
                      setAddModeratorState("none");
                      setNewModerator(null);
                    });
                  }}
                  icon={faCheck}
                  text="Yes"
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ModeratorPanel;
