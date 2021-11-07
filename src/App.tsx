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
import Links from "./pages/links/links";
import Moderator from "./pages/moderator/moderator";
import Footer from "./components/footer/footer";
import LoadingScreen from "./components/loadingScreen/loadingScreen";

function App() {
  const [admin, setAdmin] = useState(false);
  const [moderator, setModerator] = useState(false);
  const [, setUser] = useState(auth.currentUser?.uid);
  onAuthStateChanged(auth, (user) => {
    setUser(user?.uid);
    if (user !== null)
      userPrivileges.then((privileges) => {
        setAdmin(privileges.admin);
        setModerator(privileges.moderator);
      });
  });
  return (
    <div className={Styles.app}>
      <LoadingScreen />
      <Router>
        <Header admin={admin} moderator={moderator} />
        <div className={Styles.body}>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/profile" component={Profile} />
            <Route path="/links" component={Links} />
            {(admin || moderator) && (
              <Route path="/moderator" component={Moderator} />
            )}
            {admin && <Route path="/admin" component={Admin} />}
            <Redirect to="/" />
          </Switch>
          <Footer />
        </div>
      </Router>
    </div>
  );
}

export default App;
