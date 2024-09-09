
import React, { CSSProperties } from 'react';
import './ToolbarLabel.scss';

const CUIToolbarLabel = (
  args: {
    disabled?: boolean,
    textAlign?: "left" | "right",
    strong?: boolean,
    large?: boolean,
    medium?: boolean,
    tiny?: boolean,
    value: string | undefined,
    noSelect?: boolean,
    uppercase?: boolean,
    truncate?: boolean,
    marginBottom?: "l" | "m" | "s" | "xs" | "2-xs" | undefined,
    style?: CSSProperties
  }
) => {

  const {
    disabled = false,
    strong = false,
    large = false,
    medium = false,
    tiny = false,
    value,
    noSelect = false,
    uppercase = false,
    truncate = false,
    marginBottom,
    style = {}
  } = args;

  return (
    <div className={`cui-toolbar-label ${
      disabled ? 'disabled' : ''} ${
      strong ? 'strong' : ''} ${
      large ? 'large' : ''} ${
      medium ? 'medium' : ''} ${
      tiny ? 'tiny' : ''} ${
      noSelect ? 'no-select' : ''} ${
      uppercase ? 'uppercase' : ''} ${
      truncate ? 'truncate' : ''}`}
      style={{
        marginBottom: marginBottom ? `var( --ctfl-spacing-${marginBottom} )` : undefined,
        ...style
      }}>
      {`${value}`}
    </div>
  );
};

export default CUIToolbarLabel;
