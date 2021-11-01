import Styles from "./actionCard.module.scss";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function ActionCard({
  icon,
  text,
  action,
}: {
  icon: IconProp;
  text: string;
  action: Function;
}) {
  return (
    <div
      className={`uk-card uk-card-primary uk-card-body ${Styles.action}`}
      onClick={() => action()}
    >
      <FontAwesomeIcon icon={icon} size="4x" />
      <span className={Styles.text}>{text}</span>
    </div>
  );
}

export default ActionCard;
