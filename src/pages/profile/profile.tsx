import { deepEqual } from "@firebase/util";
import {
  faChevronDown,
  faChevronUp,
  faHome,
  faShare,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import UIkit from "uikit";
import {
  ActionButton,
  LinkButton,
} from "../../components/buttonWithIcon/buttonWithIcon";
import LinkDiv from "../../components/linkDiv/linkDiv";
import { auth, getUserInfo, getUserLinks } from "../../firebase";
import Styles from "./profile.module.scss";

function Profile() {
  let URLObject = new URL(window.location.href);
  const [userInfo, setUserInfo] = useState<UserDetails | null>(null);
  const [userLinks, setUserLinks] = useState<Array<LinkWithKey>>([]);
  const [selectedLink, setSelectedLink] = useState(-1);
  const uid = URLObject.searchParams.has("uid")
    ? URLObject.searchParams.get("uid")!!
    : auth.currentUser?.uid;
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
  return (
    <div className={Styles.profilePage}>
      <LinkButton link="/" icon={faHome} text="Home" />
      {userInfo ? (
        <>
          <span className={Styles.heading}>User profile</span>
          <div className={Styles.photoAndName}>
            <img
              className={Styles.photo}
              src={userInfo.profilePhoto}
              alt={userInfo.name}
            />
            <div className={Styles.nameAndBadge}>
              <span>{userInfo.name}</span>
              {userInfo.moderator && (
                <span className={Styles.moderatorBadge}>Moderator</span>
              )}
              {uid === auth.currentUser?.uid && (
                <div className={Styles.shareButton}>
                  <ActionButton
                    action={() => {
                      URLObject.searchParams.delete("uid");
                      URLObject.searchParams.set("uid", uid!!);
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
          </div>
          <span>
            Shared {userInfo.links.length} link
            {userInfo.links.length === 1 ? "" : "s"} till now
          </span>
          <div className={Styles.linksList}>
            {userLinks.map((userLink, index) => (
              <div className={Styles.linkContainer}>
                <div className={Styles.linkDiv} key={userLink.id}>
                  <div className="uk-panel uk-text-wrap uk-text-break">
                    {userLink.link.course}:{userLink.link.title}
                  </div>
                  <FontAwesomeIcon
                    icon={selectedLink === index ? faChevronUp : faChevronDown}
                    onClick={() =>
                      setSelectedLink(selectedLink === index ? -1 : index)
                    }
                  />
                </div>
                {selectedLink === index && <LinkDiv link={userLink} />}
              </div>
            ))}
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
