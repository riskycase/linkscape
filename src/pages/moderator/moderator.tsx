import {
  faChevronLeft,
  faChevronRight,
  faTimes,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { deepEqual } from "@firebase/util";
import { useState } from "react";
import { Link } from "react-router-dom";
import { deleteLink, deleteReports, getFlaggedLinks } from "../../firebase";
import Styles from "./moderator.module.scss";

function Moderator() {
  const [activeLink, setActiveLink] = useState(-1);
  const [links, setLinks] = useState<Array<FlaggedLink>>([]);
  getFlaggedLinks().then((upstreamLinks) => {
    if (!deepEqual(upstreamLinks, links)) setLinks(upstreamLinks);
  });
  console.log(links);
  return (
    <div className={Styles.moderatorPage}>
      {activeLink === -1 ? (
        <div className={Styles.flaggedLinksPanel}>
          <Link to="/">
            <button
              className={`uk-button uk-button-primary uk-button-small ${Styles.backButton}`}
            >
              <FontAwesomeIcon
                icon={faChevronLeft}
                className={Styles.buttonIcon}
              />
              <span className={Styles.buttonText}>Back to home</span>
            </button>
          </Link>
          <span className={Styles.heading}>Flagged links</span>
          {links.map((link, index) => (
            <div
              className={Styles.linkDiv}
              key={link.linkId}
              onClick={() => setActiveLink(index)}
            >
              <div className="uk-panel uk-text-wrap uk-text-break">
                {link.link.title}
              </div>
              <FontAwesomeIcon icon={faChevronRight} />
            </div>
          ))}
        </div>
      ) : (
        <div className={Styles.detailedLink}>
          <button
            className={`uk-button uk-button-primary uk-button-small ${Styles.backButton}`}
            onClick={() => setActiveLink(-1)}
          >
            <FontAwesomeIcon
              icon={faChevronLeft}
              className={Styles.buttonIcon}
            />
            <span className={Styles.buttonText}>Back to reports list</span>
          </button>
          <div className={Styles.keyValue}>
            <span className={Styles.key}>Title</span>
            <span className={`uk-text-break ${Styles.value}`}>
              {links[activeLink].link.title}
            </span>
          </div>
          <div className={Styles.keyValue}>
            <span className={Styles.key}>Link</span>
            <span className={`uk-text-truncate ${Styles.value}`}>
              {links[activeLink].link.link}
            </span>
          </div>
          <div className={Styles.keyValue}>
            <span className={Styles.key}>Shared by</span>
            <span className={`uk-text-break ${Styles.value}`}>
              <Link to={`/profile?uid=${links[activeLink].link.owner.uid}`}>
                {links[activeLink].link.owner.name}
              </Link>
            </span>
          </div>
          <div className={Styles.buttonGroup}>
            <button
              className={`uk-button uk-button-primary uk-button-small ${Styles.button}`}
              onClick={() => {
                deleteReports(links[activeLink].linkId).then(() =>
                  getFlaggedLinks().then((upstreamLinks) => {
                    setActiveLink(-1);
                    setLinks(upstreamLinks);
                  })
                );
              }}
            >
              <FontAwesomeIcon icon={faTimes} />
              <span className={Styles.buttonText}>Dismiss reports</span>
            </button>
            <button
              className={`uk-button uk-button-primary uk-button-small ${Styles.button}`}
              onClick={() => {
                deleteLink(
                  links[activeLink].linkId,
                  links[activeLink].link.owner.uid
                )
                  .then(() =>
                    getFlaggedLinks().then((upstreamLinks) => {
                      setActiveLink(-1);
                      setLinks(upstreamLinks);
                    })
                  )
                  .catch(console.error);
              }}
            >
              <FontAwesomeIcon icon={faTrash} />
              <span className={Styles.buttonText}>Delete link</span>
            </button>
          </div>
          <span className={Styles.subHeading}>Reports</span>
          {links[activeLink].reports.map((report, index) => (
            <div className={Styles.keyValue} key={index}>
              <span className={Styles.key}>Message</span>
              <span className={`uk-text-break ${Styles.value}`}>
                {report.reason}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Moderator;
