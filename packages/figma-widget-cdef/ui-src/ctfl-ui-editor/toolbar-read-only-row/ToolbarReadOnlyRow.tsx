
import React from 'react';
import './ToolbarReadOnlyRow.scss';
import CUIToolbarLabel from '../toolbar-label/ToolbarLabel.js';

const ToolbarReadOnlyRow = (
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
    value
  } = args;

  return (
    <div className={`
      cui-toolbar-read-only-row ${
      disabled ? 'disabled' : ''}`}>
      <CUIToolbarLabel value={label} disabled={disabled} />
      <div>{value}</div>
    </div>
  );
};

export default ToolbarReadOnlyRow;
