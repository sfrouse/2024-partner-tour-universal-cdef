import React, { ReactNode, CSSProperties } from 'react';
import './ToolbarPanels.scss';

const CUIToolbarPanels = (
  args: {
    selectedPanel?: string,
    children?: ReactNode,
    style?: CSSProperties
  }
) => {

  const {
    selectedPanel,
    children,
    style
  } = args;

  const modifiedChildren = React.Children.map(children, (child: ReactNode) => {
    if (React.isValidElement(child)) {
      const panelId = child.props['panelId'];
      if (panelId === selectedPanel) {
        return child
      }
    }
    return null;
  });

  return (
    <div
      className={`cui-toolbar-panels`}
      style={style}>
      {modifiedChildren}
    </div>
  );
};

export default CUIToolbarPanels;
