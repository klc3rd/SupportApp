/**
 * This element is a textarea for a standard form
 */

import React from "react";

interface ITextarea {
  name: string;
  onChange?: () => void;
  ref?: React.Ref<HTMLTextAreaElement>;
  disabled?: boolean;
  placeholder?: string;
  children?: string;
}

const TextArea: React.FC<ITextarea> = React.forwardRef((props, ref) => {
  const { name, onChange, disabled, placeholder, children } = props;
  return (
    <textarea
      name={name}
      onChange={onChange}
      disabled={disabled}
      placeholder={placeholder}
      className="form-textarea"
      ref={ref}
    >
      {children}
    </textarea>
  );
});

TextArea.displayName = "TextArea";
export default TextArea;
