
import React from 'react';
import './ToolbarSliderRow.scss';
import CUIToolbarLabel from '../toolbar-label/ToolbarLabel.js';
import CUIToolbarSlider from '../toolbar-slider/ToolbarSlider.js';

const CUIToolbarSliderRow = (
  args: {
    disabled?: boolean,
    label: string,
    value: number,
    max: number, min: number,
    onUpdate?: (val: number) => void,
    onChange?: (val: number) => void,
  }
) => {

  const {
    disabled = false,
    label,
    value = 0,
    max, min,
    onUpdate = (val: number) => null,
    onChange = (val: number) => null,
  } = args;

  return (
    <div className={`
      cui-toolbar-slider-row ${
      disabled ? 'disabled' : ''}`}>
      <CUIToolbarLabel value={label} disabled={disabled} />
      <CUIToolbarSlider
        value={value} max={max} min={min}
        onUpdate={onUpdate}
        onChange={onChange} />
    </div>
  );
};

export default CUIToolbarSliderRow;
