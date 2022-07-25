/**
 * This element is an input for a standard form
 */

import React from "react";

interface IInput {
  name: string;
  onChange?: () => void;
  ref?: React.Ref<HTMLInputElement>;
}

const Input: React.FC<IInput> = React.forwardRef((props, ref) => {
  const { name, onChange } = props;

  return (
    <input
      name={name}
      className="form-input"
      type="text"
      ref={ref}
      onChange={onChange}
    />
  );
});

Input.displayName = "Input";
export default Input;
