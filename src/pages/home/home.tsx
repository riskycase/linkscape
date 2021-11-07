import { Link } from "react-router-dom";
import Styles from "./home.module.scss";
import coverImage from "../../coverImage.svg";

function Home() {
  return (
    <div className={Styles.homeContainer}>
      <div className={Styles.heading}>Linkscape</div>
      <div className={Styles.description}>
        A user powered hub which allows you to organise and share academic
        related links with anyone
      </div>
      <div className={Styles.buttonGroup}>
        <Link to="/links">
          <button className="uk-button uk-button-primary uk-border-pill">
            Explore links
          </button>
        </Link>
      </div>
      <img src={coverImage} className={Styles.coverImage} alt="Cover" />
    </div>
  );
}

export default Home;
