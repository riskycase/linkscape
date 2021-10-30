import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import Styles from "./actionWithIcon.module.scss";

function LinkWithIcon({
  action,
  icon,
  displayText,
}: {
  action: string;
  icon: IconProp;
  displayText: string;
}) {
  return (
    <Link to={action} className={Styles.action}>
      <FontAwesomeIcon
        icon={icon}
        className={`uk-button-link ${Styles.icon}`}
      />
      <button className={`uk-button uk-button-link ${Styles.text}`}>
        {displayText}
      </button>
    </Link>
  );
}

function FunctionWithIcon({
  action,
  icon,
  displayText,
}: {
  action: Function;
  icon: IconProp;
  displayText: string;
}) {
  return (
    <span onClick={() => action()} className={Styles.action}>
      <FontAwesomeIcon
        icon={icon}
        className={`uk-button-link ${Styles.icon}`}
      />
      <button className={`uk-button uk-button-link ${Styles.text}`}>
        {displayText}
      </button>
    </span>
  );
}

export { LinkWithIcon, FunctionWithIcon };
