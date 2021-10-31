import {
  Route,
  BrowserRouter as Router,
  Switch,
  Redirect,
} from "react-router-dom";
import Header from "./components/header/header";
import Home from "./pages/home";
import Profile from "./pages/profile";
import Styles from "./App.module.scss";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, getUserPrivileges } from "./firebase";
import { useState } from "react";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState(false);
  const [moderator, setModerator] = useState(false);
  onAuthStateChanged(auth, (user) => {
    setUser(user);
    if (user !== null)
      getUserPrivileges(user.uid).then((privileges) => {
        setAdmin(privileges.admin);
        setModerator(privileges.moderator);
      });
  });
  return (
    <div className={Styles.app}>
      <Router>
        <Header user={user} admin={admin} moderator={moderator} />
        <div className={Styles.body}>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/profile" component={Profile} />
            {(admin || moderator) && (
              <Route path="/moderator" component={Profile} />
            )}
            {admin && <Route path="/admin" component={Profile} />}
            <Redirect to="/" />
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
