import React from 'react';
import './ToolbarActionRow.scss';
import CUIToolbarLabel from '../toolbar-label/ToolbarLabel';
import CUIToolbarButton from '../toolbar-button/ToolbarButton';

const CUIToolbarActionRow = (
  args: {
    disabled?: boolean,
    label: string,
    action: string,
    onAction?: () => void
  }
) => {

  const {
    disabled = false,
    label,
    action,
    onAction
  } = args;

  return (
    <div className={`
      cui-toolbar-action-row ${
      disabled ? 'disabled' : ''}`}>
      <CUIToolbarLabel value={label} disabled={disabled} />
      <CUIToolbarButton
        label={action}
        disabled={disabled}
        onClick={() => onAction ? onAction() : null} />
    </div>
  );
};

export default CUIToolbarActionRow;
