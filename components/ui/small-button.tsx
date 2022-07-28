import ShowIcon from "./icons";

interface IButton {
  children: string;
  red?: boolean;
  onClick?: () => void;
}

const SmallButton: React.FC<IButton> = (props) => {
  const { children, red, onClick } = props;

  return (
    <button
      className={`ui-small-btn ${red ? "ui-small-btn-red" : ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

SmallButton.displayName = "SmallButton";
export default SmallButton;
