import Styles from "./header.module.scss";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithRedirect,
  signOut,
} from "firebase/auth";
import { auth } from "../../firebase";
import { useState } from "react";
import {
  faHome,
  faSignOutAlt,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import {
  FunctionWithIcon,
  LinkWithIcon,
} from "../actionWithIcon/actionWithIcon";

const provider = new GoogleAuthProvider();

function Header() {
  const [user, setUser] = useState(auth.currentUser);
  const [dropdownVisibility, setDropdownVisibility] = useState(false);
  onAuthStateChanged(auth, (user) => {
    setUser(user);
    if (user === null) setDropdownVisibility(false);
  });
  return (
    <div uk-sticky="animation: uk-animation-fade; sel-target: .uk-navbar-container; cls-active: uk-navbar-sticky; cls-inactive: ; top: 200">
      <nav
        className={`uk-navbar-container uk-navbar-primary uk-padding-small ${Styles.navbar}`}
        uk-navbar="true"
      >
        <div className={`uk-navbar-right ${Styles.navItem}`}>
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
              onGotPointerCapture={() =>
                setDropdownVisibility(!dropdownVisibility)
              }
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
              <ul className={`uk-list ${Styles.optionsList}`}>
                <li>
                  <LinkWithIcon action="/" icon={faHome} displayText="Home" />
                </li>
                <li>
                  <LinkWithIcon
                    action="/profile"
                    icon={faUser}
                    displayText="My profile"
                  />
                </li>
                <li>
                  <FunctionWithIcon
                    action={() => signOut(auth)}
                    icon={faSignOutAlt}
                    displayText="Sign out"
                  />
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
