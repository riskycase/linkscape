import { IconDefinition } from "@fortawesome/fontawesome-common-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import Styles from "./button.module.scss";

function ActionButton({
  action,
  icon,
  text,
}: {
  action: React.MouseEventHandler<HTMLButtonElement>;
  icon: IconDefinition;
  text: string;
}) {
  return (
    <button
      className={`uk-button uk-button-primary uk-border-pill uk-button-small ${Styles.button}`}
      onClick={action}
    >
      <FontAwesomeIcon icon={icon} className={Styles.buttonIcon} />
      <span className={Styles.buttonText}>{text}</span>
    </button>
  );
}

function LinkButton({
  link,
  icon,
  text,
}: {
  link: string;
  icon: IconDefinition;
  text: string;
}) {
  return (
    <Link to={link}>
      <button
        className={`uk-button uk-button-primary uk-border-pill uk-button-small ${Styles.button}`}
      >
        <FontAwesomeIcon icon={icon} className={Styles.buttonIcon} />
        <span className={Styles.buttonText}>{text}</span>
      </button>
    </Link>
  );
}

export { ActionButton, LinkButton };
