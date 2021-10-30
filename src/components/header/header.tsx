import Styles from "./header.module.scss";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithRedirect,
  signOut,
} from "firebase/auth";
import { auth } from "../../firebase";
import { useState } from "react";

const provider = new GoogleAuthProvider();

function Header() {
  const [user, setUser] = useState(auth.currentUser);
  const [dropdownVisibility, setDropdownVisibility] = useState(false);
  onAuthStateChanged(auth, (user) => {
    setUser(user);
    if (user === null) setDropdownVisibility(false);
  });
  return (
    <div uk-sticky="sel-target: .uk-navbar-container; cls-active: uk-navbar-sticky">
      <nav
        className={`uk-navbar-container uk-padding-small ${Styles.navbar}`}
        uk-navbar="true"
      >
        <div className={Styles.navItem}>
          <button
            className={`uk-button uk-button-link ${Styles.signInButton}`}
            onClick={() => signInWithRedirect(auth, provider)}
            hidden={user !== null}
            id="signInButton"
          >
            Sign in
          </button>
          <div
            hidden={user === null}
            className={`uk-inline ${Styles.userContainer}`}
          >
            <div
              className={Styles.userDisplay}
              onClick={() => setDropdownVisibility(!dropdownVisibility)}
            >
              <span className={`${Styles.userName}`}>{user?.displayName}</span>
              <img
                src={user?.photoURL || ""}
                id="userImage"
                alt="Signed in"
                className={Styles.userImage}
              ></img>
              <div
                className={`${Styles.dropdown} ${
                  dropdownVisibility ? Styles.flip : ""
                }`}
              />
            </div>
            <div
              className={`${Styles.userOptions} ${
                dropdownVisibility ? "" : Styles.hidden
              }`}
            >
              <ul className={`uk-list uk-padding-small ${Styles.optionsList}`}>
                <li>
                  <button className="uk-button uk-button-link">
                    My profile
                  </button>
                </li>
                <li>
                  <button
                    className="uk-button uk-button-text"
                    onClick={() => signOut(auth)}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Header;
