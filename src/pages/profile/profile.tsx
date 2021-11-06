import { faHome, faShare } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import UIkit from "uikit";
import {
  ActionButton,
  LinkButton,
} from "../../components/buttonWithIcon/buttonWithIcon";
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
