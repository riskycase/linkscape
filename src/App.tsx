import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import Header from "./components/header/header";
import Home from "./pages/home";
import Profile from "./pages/profile";
import Styles from "./App.module.scss";

function App() {
  return (
    <div className={Styles.app}>
      <Router>
        <Header />
        <div className={Styles.body}>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/profile" component={Profile} />
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
