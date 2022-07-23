interface iButton {
  children: string;
  disabled?: boolean;
  onClick?: () => void;
}
const AuthButton: React.FC<iButton> = (props) => {
  const { children, onClick, disabled } = props;
  return (
    <button
      className="auth__container-btn"
      type="submit"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default AuthButton;
