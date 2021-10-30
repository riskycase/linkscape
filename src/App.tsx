import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import Header from "./components/header/header";
import Home from "./pages/home";
import Profile from "./pages/profile";

function App() {
  return (
    <div>
      <Router>
        <Header />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/profile" component={Profile} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
