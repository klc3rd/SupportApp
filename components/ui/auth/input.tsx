import { useState } from "react";
import { ProfileIcon, LockIcon, MailIcon } from "../icons";

interface iInput {
  type: string;
  placeholder: string;
  name: string;
  icon?: string;
}

const AuthInput: React.FC<iInput> = (props) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  let { type, placeholder, name, icon } = props;

  const showPasswordHandler = () => {
    setShowPassword((showPassState) => !showPassState);
  };

  if (showPassword) {
    type = "text";
  }

  return (
    <div className="auth__container">
      <input
        className="auth__container-input"
        placeholder={placeholder}
        type={type}
        name={name}
      />
      {icon && icon == "profile" && <ProfileIcon />}
      {icon && icon == "lock" && <LockIcon onClick={showPasswordHandler} />}
      {icon && icon == "mail" && <MailIcon />}
    </div>
  );
};

export default AuthInput;
