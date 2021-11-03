import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import Styles from "./actionWithIcon.module.scss";
import UIkit from "uikit";

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
    <Link
      to={action}
      className={Styles.action}
      onClick={() => UIkit.dropdown("#header-dropdown").hide()}
    >
      <FontAwesomeIcon
        icon={icon}
        className={`uk-button-text ${Styles.icon}`}
      />
      <button className={`uk-button uk-button-text ${Styles.text}`}>
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
    <span
      onClick={() => {
        UIkit.dropdown("#header-dropdown").hide();
        action();
      }}
      className={Styles.action}
    >
      {" "}
      <FontAwesomeIcon
        icon={icon}
        className={`uk-button-text ${Styles.icon}`}
      />
      <button className={`uk-button uk-button-text ${Styles.text}`}>
        {displayText}
      </button>
    </span>
  );
}

export { LinkWithIcon, FunctionWithIcon };
