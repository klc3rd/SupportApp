import React, { useState } from "react";
import { ProfileIcon, LockIcon, MailIcon } from "../icons";

interface iInput {
  type: string;
  placeholder: string;
  name: string;
  icon?: string;
  onChange?: () => void;
  ref?: React.Ref<HTMLInputElement>;
}

// This input element will be forwarded a ref
const AuthInput: React.FC<iInput> = React.forwardRef((props, ref) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  let { type, placeholder, name, icon, onChange } = props;

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
        onChange={onChange}
        ref={ref}
      />
      {icon && icon == "profile" && <ProfileIcon />}
      {icon && icon == "lock" && <LockIcon onClick={showPasswordHandler} />}
      {icon && icon == "mail" && <MailIcon />}
    </div>
  );
});

AuthInput.displayName = "AuthInput";
export default AuthInput;
