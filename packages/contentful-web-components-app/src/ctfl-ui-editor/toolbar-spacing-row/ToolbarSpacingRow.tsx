
import React from 'react';
import './ToolbarSpacingRow.scss';
import CUIToolbarLabel from '../toolbar-label/ToolbarLabel';
import {
  CDefInstanceValue,
  CDefSpacing
} from '@contentful-demos/component-definitions';
import CUIToolbarInput from '../toolbar-input/ToolbarInput';
// import CUIToolbarInput from '../toolbar-input/ToolbarInput';

const CUIToolbarSpacingRow = (
  args: {
    disabled?: boolean,
    label: string | undefined,
    value: CDefInstanceValue | undefined,
    type?: 'string' | 'number',
    onUpdate?: (val: CDefSpacing) => void,
    onChange?: (val: CDefSpacing) => void,
  }
) => {

  const {
    disabled = false,
    label,
    value,
    // type = 'string',
    onUpdate = () => null,
    onChange = () => null,
  } = args;

  // TODO: check for correct type...
  const valueSpacing = value as CDefSpacing;
  let inputs = (<div>Not a Spacing Object</div>);
  if (
    valueSpacing?.top !== undefined &&
    valueSpacing?.bottom !== undefined &&
    valueSpacing?.left !== undefined &&
    valueSpacing?.right !== undefined
  )  {
    inputs = (<div >
      T
      <CUIToolbarInput
        value={`${valueSpacing?.top}`}
        type="number"
        disabled={disabled}
        textAlign='right'
        onChange={(val) => onChange({...valueSpacing, top: parseInt(val)})}
        onUpdate={(val) => onUpdate({...valueSpacing, top: parseInt(val)})} />
      B
      <CUIToolbarInput
        value={`${valueSpacing?.bottom}`}
        type="number"
        disabled={disabled}
        textAlign='right'
        onChange={(val) => onChange({...valueSpacing, bottom: parseInt(val)})}
        onUpdate={(val) => onUpdate({...valueSpacing, bottom: parseInt(val)})}/>
      L
      <CUIToolbarInput
        value={`${valueSpacing?.left}`}
        type="number"
        disabled={disabled}
        textAlign='right'
        onChange={(val) => onChange({...valueSpacing, left: parseInt(val)})}
        onUpdate={(val) => onUpdate({...valueSpacing, left: parseInt(val)})} />
      R
      <CUIToolbarInput
        value={`${valueSpacing?.right}`}
        type="number"
        disabled={disabled}
        textAlign='right'
        onChange={(val) => onChange({...valueSpacing, right: parseInt(val)})}
        onUpdate={(val) => onUpdate({...valueSpacing, right: parseInt(val)})} />
    </div>);
  }

  return (
    <div className={`
      cui-toolbar-spacing-row ${
      disabled ? 'disabled' : ''}`}>
      <CUIToolbarLabel value={label} disabled={disabled} />
      {inputs}
    </div>
  );
};

export default CUIToolbarSpacingRow;
