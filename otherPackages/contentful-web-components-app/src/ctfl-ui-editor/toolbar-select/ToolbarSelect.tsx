
import React from 'react';
import './ToolbarSelect.scss';

const CUIToolbarSelect = (
  args: {
    disabled?: boolean,
    textAlign?: "left" | "right",
    value: string | undefined,
    options?: {[key:string]: string},
    className?: string,
    onChange?: (val: string) => void,
  }
) => {

  const {
    disabled = false,
    textAlign = 'left',
    value,
    options = {},
    className,
    onChange = (val: string) => null,
  } = args;

  return (
    <div className={`cui-toolbar-select text-align-${textAlign} ${className}`}>
      <select
        value={value}
        disabled={disabled}
        placeholder='Select Option...'
        onChange={(evt) => onChange(evt.target.value)}>
          <option value=""></option>
          {options ? Object.entries(options).map(option => {
            const key = option[0];
            const value = option[1];
            return (
              <option value={value} key={key}>{key}</option>
            );
          }) : ''}
      </select>
    </div>
  );
};

export default CUIToolbarSelect;
