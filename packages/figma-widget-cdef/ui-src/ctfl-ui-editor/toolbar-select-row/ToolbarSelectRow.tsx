
import React from 'react';
import './ToolbarSelectRow.scss';
import CUIToolbarLabel from '../toolbar-label/ToolbarLabel.js';
import CUIToolbarSelect from '../toolbar-select/ToolbarSelect.js';

const CUIToolbarSelectRow = (
  args: {
    disabled?: boolean,
    label: string | undefined,
    value: string | undefined,
    options: {[key:string]: string} | undefined,
    onChange?: (val: string) => void,
  }
) => {

  const {
    disabled = false,
    label,
    value,
    options,
    onChange = (val: string) => null,
  } = args;

  return (
    <div className={`
      cui-toolbar-select-row ${
      disabled ? 'disabled' : ''}`}>
      <CUIToolbarLabel value={label} disabled={disabled} />
      <CUIToolbarSelect
        value={value}
        disabled={disabled}
        options={options}
        textAlign='right'
        onChange={onChange} />
    </div>
  );
};

export default CUIToolbarSelectRow;
