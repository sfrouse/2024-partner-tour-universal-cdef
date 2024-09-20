
import React from 'react';
import './ToolbarInputRow.scss';
import CUIToolbarLabel from '../toolbar-label/ToolbarLabel';
import CUIToolbarInput from '../toolbar-input/ToolbarInput';

const CUIToolbarInputRow = (
  args: {
    disabled?: boolean,
    label: string | undefined,
    value: string | undefined,
    type?: 'string' | 'number',
    onUpdate?: (val: string) => void,
    onChange?: (val: string) => void,
  }
) => {

  const {
    disabled = false,
    label,
    value,
    type = 'string',
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
        textAlign='right'
        onChange={onChange}
        onUpdate={onUpdate} />
    </div>
  );
};

export default CUIToolbarInputRow;
