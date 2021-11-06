import { Link } from "react-router-dom";
import Styles from "./linkDiv.module.scss";

function LinkDiv({ link }: { link: LinkWithKey }) {
  return (
    <div className={Styles.linkDiv}>
      <div className={Styles.keyValue}>
        <span className={Styles.key}>Title</span>
        <span className={`uk-text-break ${Styles.value}`}>
          {link.link.title}
        </span>
      </div>
      <div className={Styles.keyValue}>
        <span className={Styles.key}>Link</span>
        <span className={`uk-text-break ${Styles.value}`}>
          {link.link.link}
        </span>
      </div>
      <div className={Styles.keyValue}>
        <span className={Styles.key}>Shared by</span>
        <span className={`uk-text-break ${Styles.value}`}>
          <Link to={`/profile?uid=${link.link.owner.uid}`}>
            {link.link.owner.name}
          </Link>
        </span>
      </div>
    </div>
  );
}

export default LinkDiv;
