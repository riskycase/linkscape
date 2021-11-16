import { deepEqual } from "@firebase/util";
import {
  faChevronDown,
  faChevronUp,
  faExternalLinkAlt,
  faShare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useHistory } from "react-router";
import UIkit from "uikit";
import { ActionButton } from "../../components/buttonWithIcon/buttonWithIcon";
import LinkDiv from "../../components/linkDiv/linkDiv";
import { auth, deleteLink, getUserInfo, getUserLinks } from "../../firebase";
import Styles from "./profile.module.scss";

function Profile() {
  const history = useHistory();
  let URLObject = new URL(window.location.href);
  const [userInfo, setUserInfo] = useState<UserDetails | null>(null);
  const [userLinks, setUserLinks] = useState<Array<LinkWithKey>>([]);
  const [selectedLink, setSelectedLink] = useState(-1);
  const uid = URLObject.searchParams.has("uid")
    ? URLObject.searchParams.get("uid")!!
    : auth.currentUser?.uid;
  if (auth.currentUser || URLObject.searchParams.has("uid"))
    getUserInfo(uid!!)
      .then((upstreamUserInfo) => {
        if (!userInfo) setUserInfo(upstreamUserInfo);
      })
      .then(() => {
        getUserLinks(uid!!).then((upstreamLinks) => {
          if (!deepEqual(upstreamLinks, userLinks)) setUserLinks(upstreamLinks);
        });
      })
      .catch(() => setUserInfo(null));
  else history.push("/");
  return (
    <div className={Styles.profilePage}>
      {userInfo ? (
        <>
          <div className={Styles.photoAndName}>
            <img
              className={Styles.photo}
              src={userInfo.profilePhoto}
              alt={userInfo.name}
            />
            <div className={Styles.nameAndBadge}>
              <span>{userInfo.name}</span>
              {userInfo.moderator && (
                <span className={`uk-border-pill ${Styles.moderatorBadge}`}>
                  Moderator
                </span>
              )}
            </div>
          </div>
          <span>
            Shared {userLinks.length} link
            {userLinks.length === 1 ? "" : "s"} till now
          </span>
          <div className={Styles.linksList}>
            {userLinks.map((userLink, index) => (
              <div className={Styles.linkContainer} key={userLink.id}>
                <div
                  className={Styles.linkDiv}
                  onClick={() =>
                    setSelectedLink(selectedLink === index ? -1 : index)
                  }
                >
                  <div className="uk-panel uk-text-wrap uk-text-break">
                    {userLink.link.course} - {userLink.link.title}
                  </div>
                  <FontAwesomeIcon
                    icon={selectedLink === index ? faChevronUp : faChevronDown}
                  />
                </div>
                {selectedLink === index && (
                  <div className={Styles.linkDetails}>
                    <LinkDiv link={userLink} />
                    <div className={Styles.buttonGroup}>
                      {auth.currentUser && uid === auth.currentUser.uid && (
                        <ActionButton
                          icon={faTrash}
                          text="Delete"
                          action={() => {
                            deleteLink(userLink.id, auth.currentUser!!.uid!!)
                              .then(() => getUserInfo(uid!!))
                              .then((upstreamUserInfo) => {
                                if (!userInfo) setUserInfo(upstreamUserInfo);
                              })
                              .then(() => {
                                getUserLinks(uid!!).then((upstreamLinks) => {
                                  if (!deepEqual(upstreamLinks, userLinks))
                                    setUserLinks(upstreamLinks);
                                  setSelectedLink(-1);
                                });
                              })
                              .catch(() => setUserInfo(null));
                          }}
                        />
                      )}
                      <ActionButton
                        action={() => {
                          let link = userLink.link.link;
                          if (!link.startsWith("http")) link = "http://" + link;
                          window.open(link, "_blank");
                        }}
                        icon={faExternalLinkAlt}
                        text="Open"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
            {auth.currentUser && uid === auth.currentUser.uid && (
              <div className={Styles.shareButton}>
                <ActionButton
                  action={() => {
                    URLObject.searchParams.set("uid", auth.currentUser?.uid!!);
                    navigator.clipboard.writeText(URLObject.href).then(() => {
                      UIkit.notification("Profile URL copied to clipboard", {
                        status: "success",
                        timeout: 1500,
                      });
                      URLObject = new URL(window.location.href);
                    });
                  }}
                  icon={faShare}
                  text="Share profile"
                />
              </div>
            )}
          </div>
        </>
      ) : (
        URLObject.searchParams.has("uid") && (
          <div className={Styles.doesntExist}>
            <div className="uk-card uk-card-body uk-card-primary">
              <h3 className="uk-card-title">User not found</h3>
              <p>A user with that id could not be found</p>
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default Profile;
