
import React from 'react';
import './ToolbarInput.scss';

const CUIToolbarInput = (
  args: {
    disabled?: boolean,
    textAlign?: "left" | "right",
    value: string | undefined,
    type?: 'string' | 'number',
    className?: string,
    onUpdate?: (val: string) => void,
    onChange?: (val: string) => void,
  }
) => {

  const {
    disabled = false,
    textAlign = 'left',
    value,
    type = 'string',
    className,
    onUpdate = (val: string) => null,
    onChange = (val: string) => null,
  } = args;

  return (
    <div className={`cui-toolbar-input text-align-${textAlign} ${className}`}>
      <input
        disabled={disabled}
        value={value}
        onBlur={(evt) => onUpdate(evt.target.value)}
        type={type}
        onChange={(evt) => onChange(evt.target.value)}>
      </input>
    </div>
  );
};

export default CUIToolbarInput;
