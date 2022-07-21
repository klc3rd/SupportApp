interface iButton {
  children: string;
}
const AuthButton: React.FC<iButton> = (props) => {
  const { children } = props;
  return (
    <button className="auth__container-btn" type="submit">
      {children}
    </button>
  );
};

export default AuthButton;
