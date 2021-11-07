import Styles from "./header.module.scss";
import {
  GoogleAuthProvider,
  signInWithRedirect,
  signOut,
  User,
} from "firebase/auth";
import { auth } from "../../firebase";
import {
  faCogs,
  faHome,
  faSignOutAlt,
  faUser,
  faUsersCog,
} from "@fortawesome/free-solid-svg-icons";
import {
  FunctionWithIcon,
  LinkWithIcon,
} from "../actionWithIcon/actionWithIcon";

const provider = new GoogleAuthProvider();

function Header({
  user,
  admin,
  moderator,
}: {
  user: User | null;
  admin: boolean;
  moderator: boolean;
}) {
  return (
    <div uk-sticky="animation: uk-animation-fade; sel-target: .uk-navbar-container; cls-active: uk-navbar-sticky; cls-inactive: ; top: 200">
      <nav
        className={`uk-navbar-container uk-navbar-transparent uk-padding-small ${Styles.navbar}`}
        uk-navbar="true"
      >
        <div className={`uk-navbar-right ${Styles.navItem}`}>
          <ul className="uk-navbar-nav">
            <li>
              <button
                className={`uk-button uk-button-link ${Styles.signInButton}`}
                onClick={() => signInWithRedirect(auth, provider)}
                hidden={user !== null}
                id="signInButton"
              >
                Sign in
              </button>
            </li>
            <li hidden={user === null} className={Styles.userContainer}>
              <span className={Styles.userDisplay}>
                <span className={`${Styles.userName}`}>
                  {user?.displayName}
                </span>
                <img
                  src={user?.photoURL || ""}
                  id="userImage"
                  alt="Signed in"
                  className={Styles.userImage}
                ></img>
                <div className={Styles.dropdownButton} />
              </span>
              <div
                className={`uk-navbar-dropdown uk-light ${Styles.dropdown}`}
                id="header-dropdown"
              >
                <ul className={`uk-nav uk-navbar-dropdown-nav`}>
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
                  {(admin || moderator) && (
                    <>
                      <li className="uk-nav-divider"></li>
                      <li>
                        <LinkWithIcon
                          action="/moderator"
                          icon={faUsersCog}
                          displayText="Moderator page"
                        />
                      </li>
                      {admin && (
                        <li>
                          <LinkWithIcon
                            action="/admin"
                            icon={faCogs}
                            displayText="Admin Dashboard"
                          />
                        </li>
                      )}
                    </>
                  )}
                  <li className="uk-nav-divider"></li>
                  <li>
                    <FunctionWithIcon
                      action={() => signOut(auth)}
                      icon={faSignOutAlt}
                      displayText="Sign out"
                    />
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default Header;
