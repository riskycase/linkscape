import { useState } from "react";
import { userReady } from "../../firebase";
import Styles from "./loadingScreen.module.scss";

function LoadingScreen() {
  const [userPresent, setUserPresent] = useState(false);
  userReady.once("ready", () => setUserPresent(true));
  return (
    <div
      className={`${Styles.loadingScreen} ${userPresent ? Styles.hide : ""}`}
    >
      <span className={Styles.heading}>Linkscape</span>
      <span className={Styles.subHeading}>Fetching data from server</span>
    </div>
  );
}

export default LoadingScreen;
