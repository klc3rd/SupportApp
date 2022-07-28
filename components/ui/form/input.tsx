/**
 * This element is an input for a standard form
 */

import React from "react";

interface IInput {
  name: string;
  onChange?: () => void;
  ref?: React.Ref<HTMLInputElement>;
  maxLength?: number;
  placeholder?: string;
}

const Input: React.FC<IInput> = React.forwardRef((props, ref) => {
  const { name, onChange, maxLength, placeholder } = props;

  return (
    <input
      name={name}
      className="form-input"
      type="text"
      ref={ref}
      maxLength={maxLength ? maxLength : 20}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
});

Input.displayName = "Input";
export default Input;
