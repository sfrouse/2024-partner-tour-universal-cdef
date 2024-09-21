import React, { useState , ReactNode } from 'react';
import './ToolbarTabs.scss';

const CUIToolbarTabs = (
  args: {
    selectedTab?: string,
    children?: ReactNode,
    secondary?: boolean,
    onSelectedTabChange?: (selectedTab: string) => void
  }
) => {

  const {
    selectedTab,
    children,
    secondary = false,
    onSelectedTabChange
  } = args;

  const modifiedChildren = React.Children.map(children, (child: ReactNode) => {
    if (React.isValidElement(child)) {
      const tabId = child.props['tabId'];
      return React.cloneElement(child, {
        selected: tabId === selectedTab,
        onClick: () => {
          onSelectedTabChange ? onSelectedTabChange(tabId) : null;
        }
      } as any);
    }
    return child;
  });

  return (
    <div
      className={`cui-toolbar-tabs
        ${secondary ? 'secondary' : ''}`}>
      {modifiedChildren}
      {secondary ? '' : (<div className='border'></div>)}
    </div>
  );
};

export default CUIToolbarTabs;
