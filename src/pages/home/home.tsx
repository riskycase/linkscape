import { Link } from "react-router-dom";
import Styles from "./home.module.scss";

function Home() {
  return (
    <div className={Styles.homeContainer}>
      <span className={Styles.homeHeading}>
        Linkscape, a user powered hub which allows you to organise and share
        academic related links with anyone
      </span>
      <div className={Styles.buttonGroup}>
        <Link to="/links">
          <button className="uk-button uk-button-primary uk-border-pill">
            Explore links
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
