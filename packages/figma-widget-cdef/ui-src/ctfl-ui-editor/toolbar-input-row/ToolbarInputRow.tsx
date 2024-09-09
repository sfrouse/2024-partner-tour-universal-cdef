
import React from 'react';
import './ToolbarInputRow.scss';
import CUIToolbarLabel from '../toolbar-label/ToolbarLabel.js';
import CUIToolbarInput from '../toolbar-input/ToolbarInput.js';

const CUIToolbarInputRow = (
  args: {
    disabled?: boolean,
    label: string | undefined,
    value: string | undefined,
    type?: 'string' | 'number' | 'password',
    textAlign?: "left" | "right",
    onUpdate?: (val: string) => void,
    onChange?: (val: string) => void,
  }
) => {

  const {
    disabled = false,
    label,
    value,
    type = 'string',
    textAlign = 'right',
    onUpdate = () => null,
    onChange = (val: string) => null,
  } = args;

  return (
    <div className={`
      cui-toolbar-input-row ${
      disabled ? 'disabled' : ''}`}>
      <CUIToolbarLabel value={label} disabled={disabled} />
      <CUIToolbarInput
        value={value}
        type={type}
        disabled={disabled}
        textAlign={textAlign}
        onChange={onChange}
        onUpdate={onUpdate} />
    </div>
  );
};

export default CUIToolbarInputRow;
