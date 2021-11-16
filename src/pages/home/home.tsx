import Styles from "./home.module.scss";
import coverImage from "../../coverImage.svg";
import { LinkButton } from "../../components/buttonWithIcon/buttonWithIcon";

function Home() {
  return (
    <div className={Styles.homeContainer}>
      <div className={Styles.heading}>Linkscape</div>
      <div className={Styles.description}>
        A user powered hub which allows you to organise and share academic
        related links with anyone
      </div>
      <div className={Styles.buttonGroup}>
        <LinkButton text="Explore links" link="/links" />
      </div>
      <img src={coverImage} className={Styles.coverImage} alt="Cover" />
    </div>
  );
}

export default Home;
