import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Link } from "react-router-dom";
import UIkit from "uikit";
import { auth, getUserInfo } from "../../firebase";
import Styles from "./profile.module.scss";

function Profile() {
  let URLObject = new URL(window.location.href);
  const [userInfo, setUserInfo] = useState<UserDetails | null>(null);
  const uid = URLObject.searchParams.has("uid")
    ? URLObject.searchParams.get("uid")!!
    : auth.currentUser?.uid;
  getUserInfo(uid!!)
    .then((upstreamUserInfo) => {
      if (!userInfo) setUserInfo(upstreamUserInfo);
    })
    .catch(() => setUserInfo(null));
  return (
    <div className={Styles.profilePage}>
      <Link to="/">
        <button
          className={`uk-button uk-button-primary uk-button-small ${Styles.backButton}`}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
          Back
        </button>
      </Link>
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
            </div>
          </div>
          <span>
            Shared {userInfo.links.length} link
            {userInfo.links.length === 1 ? "" : "s"} till now
          </span>
          {uid === auth.currentUser?.uid && (
            <button
              className={`uk-button uk-button-small uk-button-primary ${Styles.shareButton}`}
              onClick={() => {
                URLObject.searchParams.delete("uid");
                URLObject.searchParams.set("uid", uid!!);
                navigator.clipboard.writeText(URLObject.href).then(() => {
                  UIkit.notification("Profile URL copied to clipboard", {
                    status: "success",
                  });
                  URLObject = new URL(window.location.href);
                });
              }}
            >
              Share profile
            </button>
          )}
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
