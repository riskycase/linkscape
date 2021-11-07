import {
  faGithub,
  faInstagram,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";
import {
  faEnvelope,
  faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Styles from "./footer.module.scss";

function Footer() {
  return (
    <div className={Styles.footer}>
      <span className={Styles.text}>
        Made by Hrishikesh Patil, powered by you
      </span>
      <span className={Styles.socialIcons}>
        <a href="https://www.linkedin.com/in/riskycase/">
          <FontAwesomeIcon icon={faLinkedinIn} className={Styles.socialIcon} />
        </a>
        <a href="https://www.instagram.com/risky.case/">
          <FontAwesomeIcon icon={faInstagram} className={Styles.socialIcon} />
        </a>
        <a href="mailto:f20202095@goa.bits-pilani.ac.in">
          <FontAwesomeIcon icon={faEnvelope} className={Styles.socialIcon} />
        </a>
        <a href="https://github.com/riskycase/linkscape">
          <FontAwesomeIcon icon={faGithub} className={Styles.socialIcon} />
        </a>
      </span>
      <a
        className={Styles.formLink}
        href="https://docs.google.com/forms/d/e/1FAIpQLSeGg_l5ErSVrFingtnFOdTc8k0RbJShMl3-QmufZoTo1S4w2Q/viewform?usp=sf_link"
      >
        Issues? Report here{" "}
        <FontAwesomeIcon icon={faExternalLinkAlt} className={Styles.formIcon} />
      </a>
    </div>
  );
}

export default Footer;
