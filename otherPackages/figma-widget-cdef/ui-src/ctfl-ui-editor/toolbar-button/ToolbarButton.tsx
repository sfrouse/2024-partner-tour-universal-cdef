
import React from 'react';
import './ToolbarButton.scss';

const CUIToolbarButton = (
  args: {
    disabled?: boolean,
    textAlign?: "left" | "right",
    label: string,
    onClick?: () => void
  }
) => {

  const {
    disabled = false,
    label,
    onClick,
  } = args;

  return (
    <button
      className={`cui-toolbar-button`}
      disabled={disabled}
      onClick={() => onClick ? onClick() : null}>
      {label}
    </button>
  );
};

export default CUIToolbarButton;
