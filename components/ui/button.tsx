import ShowIcon from "./icons";

interface IButton {
  children: string;
  icon?: string;
  onClick?: () => void;
}

const Button: React.FC<IButton> = (props) => {
  const { children, icon, onClick } = props;

  return (
    <button className="ui-btn" onClick={onClick}>
      {children}
      {icon && <ShowIcon icon={icon} />}
    </button>
  );
};

Button.displayName = "Button";
export default Button;
