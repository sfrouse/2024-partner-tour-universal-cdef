
import React from 'react';
import './ToolbarHeader.scss';
import CUIToolbarLabel from '../toolbar-label/ToolbarLabel';

const CUIToolbarHeader = (
  args: {
    disabled?: boolean,
    header: string | undefined,
    subtitle: string | undefined,
    children?: any,
    onClick?: () => void
  }
) => {

  const {
    disabled = false,
    header,
    subtitle,
    children,
    onClick
  } = args;

  return (
    <div className={`
      cui-toolbar-header ${
      disabled ? 'disabled' : ''}`}>
      <div className={`titles ${onClick ? 'clickable' : ''}`}
        onClick={() => onClick ? onClick() : null}>
        <CUIToolbarLabel
          large
          strong
          value={header}
          disabled={disabled}
          noSelect />
        <CUIToolbarLabel
          value={subtitle}
          disabled={disabled}
          noSelect />
      </div>
      <div className='slot'>
        {children}
      </div>
    </div>
  );
};

export default CUIToolbarHeader;
