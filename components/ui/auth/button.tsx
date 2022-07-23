interface iButton {
  children: string;
  onClick?: () => void;
}
const AuthButton: React.FC<iButton> = (props) => {
  const { children, onClick } = props;
  return (
    <button className="auth__container-btn" type="submit" onClick={onClick}>
      {children}
    </button>
  );
};

export default AuthButton;
