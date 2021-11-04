import {
  Route,
  BrowserRouter as Router,
  Switch,
  Redirect,
} from "react-router-dom";
import Header from "./components/header/header";
import Home from "./pages/home/home";
import Profile from "./pages/profile/profile";
import Styles from "./App.module.scss";
import { onAuthStateChanged } from "firebase/auth";
import { auth, userPrivileges } from "./firebase";
import { useState } from "react";
import Admin from "./pages/admin/admin";
import AddLink from "./pages/addLink/addLink";

function App() {
  const [, setUid] = useState(auth.currentUser?.uid);
  const [admin, setAdmin] = useState(false);
  const [moderator, setModerator] = useState(false);
  onAuthStateChanged(auth, (user) => {
    setUid(user?.uid);
    if (user !== null)
      userPrivileges.then((privileges) => {
        setAdmin(privileges.admin);
        setModerator(privileges.moderator);
      });
  });
  return (
    <div className={Styles.app}>
      <Router>
        <Header user={auth.currentUser} admin={admin} moderator={moderator} />
        <div className={Styles.body}>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/profile" component={Profile} />
            <Route path="/links" component={Profile} />
            {auth.currentUser && <Route path="/add" component={AddLink} />}
            {(admin || moderator) && (
              <Route path="/moderator" component={Profile} />
            )}
            {admin && <Route path="/admin" component={Admin} />}
            <Redirect to="/" />
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
