import React, { useState , ReactNode } from 'react';
import './ToolbarPanel.scss';

const CUIToolbarPanel = (
  args: {
    panelId: string,
    children: ReactNode
  }
) => {

  const {
    children
  } = args

  return (
    <div
      className={`cui-toolbar-panel`}>
      {children}
    </div>
  );
};

export default CUIToolbarPanel;
