
import React from 'react';
import './ToolbarSection.scss';
import CUIToolbarLabel from '../toolbar-label/ToolbarLabel.js';

const CUIToolbarSection = (
  args: {
    disabled?: boolean,
    label: string,
    onAddNew?: () => void
  }
) => {

  const {
    disabled = false,
    label,
    // onAddNew = () => null,
  } = args;

  return (
    <div className={`
      cui-toolbar-section ${
      disabled ? 'disabled' : ''}`}>
      <CUIToolbarLabel
        value={label}
        disabled={disabled}
        noSelect />
    </div>
  );
};

export default CUIToolbarSection;
