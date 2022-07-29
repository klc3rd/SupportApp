interface IButton {
  children: string;
  red?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

const SmallButton: React.FC<IButton> = (props) => {
  const { children, red, onClick, disabled } = props;

  return (
    <button
      className={`ui-small-btn ${red ? "ui-small-btn-red" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

SmallButton.displayName = "SmallButton";
export default SmallButton;
