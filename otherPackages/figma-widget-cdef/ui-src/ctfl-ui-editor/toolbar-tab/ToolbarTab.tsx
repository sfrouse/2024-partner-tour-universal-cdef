
import React from 'react';
import './ToolbarTab.scss';

const CUIToolbarTab = (
  args: {
    disabled?: boolean,
    textAlign?: "left" | "right",
    label: string,
    tabId: string,
    selected?: boolean
    secondary?: boolean
    onClick?: () => void
  }
) => {

  const {
    disabled = false,
    label,
    tabId,
    selected = false,
    secondary = false,
    onClick,
  } = args;

  return (
    <button
      className={`cui-toolbar-tab 
        ${selected ? 'selected' : ''}
        ${secondary ? 'secondary' : ''}`}
      data-tab-id={tabId}
      disabled={disabled}
      onClick={() => onClick ? onClick() : null}>
      {label}
    </button>
  );
};

export default CUIToolbarTab;
