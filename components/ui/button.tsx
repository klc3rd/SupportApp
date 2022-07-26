import ShowIcon from "./icons";

interface IButton {
  children: string;
  icon?: string;
  red?: boolean;
  onClick?: () => void;
}

const Button: React.FC<IButton> = (props) => {
  const { children, icon, red, onClick } = props;

  return (
    <button
      className={`ui-btn ${red ? "ui-btn-red" : ""} ${
        icon ? "ui-btn-icon" : ""
      }`}
      onClick={onClick}
    >
      {children}
      {icon && <ShowIcon icon={icon} />}
    </button>
  );
};

Button.displayName = "Button";
export default Button;
