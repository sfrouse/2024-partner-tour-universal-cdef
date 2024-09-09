
import React, { ReactElement } from 'react';
import './ToolbarHeader.scss';
import CUIToolbarLabel from '../toolbar-label/ToolbarLabel.js';

const CUIToolbarHeader = (
  args: {
    disabled?: boolean,
    header: string | undefined,
    subtitle?: string | undefined,
    style?: 'app' | 'default',
    children?: ReactElement,
    toolbar?: ReactElement,
    onClick?: () => void
  }
) => {

  const {
    disabled = false,
    style = 'default',
    header,
    subtitle,
    children,
    toolbar,
    onClick
  } = args;

  return (
    <div className={`
      cui-toolbar-header ${
      disabled ? 'disabled' : ''} ${
      style}-style`}>
      <div className={`titles ${onClick ? 'clickable' : ''}`}
        onClick={() => onClick ? onClick() : null}>
        <CUIToolbarLabel
          large
          strong
          value={header}
          disabled={disabled}
          noSelect />
        {subtitle ? (
          <CUIToolbarLabel
            value={subtitle}
            disabled={disabled}
            noSelect />) : ''
        }
      </div>
      {children || ''}
    </div>
  );
};

export default CUIToolbarHeader;
