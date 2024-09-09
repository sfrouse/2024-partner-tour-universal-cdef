
import React from 'react';
import './ToolbarSwitchRow.scss';
import CUIToolbarLabel from '../toolbar-label/ToolbarLabel.js';
import { Switch } from '@contentful/f36-forms';

const CUIToolbarSwitchRow = (
  args: {
    disabled?: boolean,
    label: string,
    value: boolean,
    onChange?: (val: boolean) => void,
  }
) => {

  const {
    disabled = false,
    label,
    value,
    onChange
  } = args;

  return (
    <div className={`
      cui-toolbar-switch-row ${
      disabled ? 'disabled' : ''}`}>
      <CUIToolbarLabel
        value={label} disabled={disabled} />
      <Switch
        isChecked={value}
        isDisabled={disabled}
        onChange={() => onChange ? onChange(!value) : null} />
    </div>
  );
};

export default CUIToolbarSwitchRow;
