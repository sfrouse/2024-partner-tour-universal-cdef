
import React from 'react';
import './ToolbarLayoutRow.scss';
import CUIToolbarLabel from '../toolbar-label/ToolbarLabel';
import {
  CDefInstanceValue,
  CDefLayoutValue,
  CDefTokens
} from '@contentful-demos/component-definitions';
import CUIToolbarInput from '../toolbar-input/ToolbarInput';
import CUIToolbarSelect from '../toolbar-select/ToolbarSelect';
// import { layoutToCss } from 'contentful-web-components/dist';
// import CUIToolbarInput from '../toolbar-input/ToolbarInput';


function processLayoutObj(layout: CDefLayoutValue): CDefLayoutValue {
  return {
    ...layout,
    // ...layoutToCss(layout), 
  }
}

const CUIToolbarLayoutRow = (
  args: {
    disabled?: boolean,
    label: string | undefined,
    value: CDefInstanceValue | undefined,
    type?: 'string' | 'number',
    onUpdate?: (val: CDefLayoutValue) => void,
    onChange?: (val: CDefLayoutValue) => void,
    cdefTokens: CDefTokens | undefined,
  }
) => {

  const {
    disabled = false,
    // label,
    value,
    // type = 'string',
    onUpdate = () => null,
    onChange = () => null,
    cdefTokens,
  } = args;

  // TODO: check for correct type...
  const layout = value as CDefLayoutValue || {};
  let inputs = (<div>Not a Spacing Object</div>);
  // TODO: deal with string in layout object...
  if (layout)  {
    inputs = (
      <div className=' cui-toolbar-layout-row'>
        {/* POSITION */}
        <div className='input-row'>
          <CUIToolbarLabel value="Position" disabled={disabled} />
          <CUIToolbarSelect
            value={`${layout.position ? layout.position : 'relative'}`}
            disabled={disabled}
            options={{
              'Relative': 'relative',
              'Absolute': 'absolute'
            }}
            onChange={(val) => onUpdate(processLayoutObj({
              ...layout,
              position: val as any
            }))} />
        </div>
        <hr />
        <div className='input-row'>
          <CUIToolbarLabel value="Padding" disabled={disabled} />
          <div>
            <CUIToolbarInput
              value={`${layout.padding ? layout.padding[3] : 0}`}
              type="number"
              disabled={disabled}
              textAlign='right'
              onChange={(val) => onChange(processLayoutObj({
                ...layout,
                padding: layout.padding ?
                  [layout.padding[0], layout.padding[1], layout.padding[2], parseInt(val)] :
                  [0, 0, 0, parseInt(val)]
              }))}
              onUpdate={(val) => onUpdate(processLayoutObj({
                ...layout,
                padding: layout.padding ?
                  [layout.padding[0], layout.padding[1], layout.padding[2], parseInt(val)] :
                  [0, 0, 0, parseInt(val)]
              }))} />
            <div className="top-bottom-padding">
              <CUIToolbarInput
                value={`${layout.padding ? layout.padding[0] : 0}`}
                type="number"
                disabled={disabled}
                textAlign='right'
                onChange={(val) => onChange(processLayoutObj({
                  ...layout,
                  padding: layout.padding ?
                    [parseInt(val), layout.padding[1], layout.padding[2], layout.padding[3]] :
                    [0, parseInt(val), 0, 0]
                }))}
                onUpdate={(val) => onUpdate(processLayoutObj({
                  ...layout,
                  padding: layout.padding ?
                    [parseInt(val), layout.padding[1], layout.padding[2], layout.padding[3]] :
                    [0, parseInt(val), 0, 0]
                }))} />
              <CUIToolbarInput
                value={`${layout.padding ? layout.padding[2] : 0}`}
                type="number"
                disabled={disabled}
                textAlign='right'
                onChange={(val) => onChange(processLayoutObj({
                  ...layout,
                  padding: layout.padding ?
                    [layout.padding[0], layout.padding[1], parseInt(val), layout.padding[3]] :
                    [0,  0, parseInt(val),0]
                }))}
                onUpdate={(val) => onUpdate(processLayoutObj({
                  ...layout,
                  padding: layout.padding ?
                    [layout.padding[0], layout.padding[1], parseInt(val), layout.padding[3]] :
                    [0,  0, parseInt(val),0]
                }))} />
              </div>
          <CUIToolbarInput
            value={`${layout.padding ? layout.padding[1] : 0}`}
            type="number"
            disabled={disabled}
            textAlign='right'
            onChange={(val) => onChange(processLayoutObj({
              ...layout,
              padding: layout.padding ?
                [layout.padding[0], parseInt(val), layout.padding[2], layout.padding[3]] :
                [0, parseInt(val), 0, 0]
            }))}
            onUpdate={(val) => onUpdate(processLayoutObj({
              ...layout,
              padding: layout.padding ?
                [layout.padding[0], parseInt(val), layout.padding[2], layout.padding[3]] :
                [0, parseInt(val), 0, 0]
            }))} />
          </div>
        </div>
        <div className='input-row'>
          <CUIToolbarLabel value="Gap" disabled={disabled} />
          <div>
            <CUIToolbarSelect
                value={`${layout.horizontalGap ? layout.horizontalGap : 0}`}
                disabled={disabled}
                options={cdefTokens?.spacing}
                onChange={(val) => onUpdate(processLayoutObj({
                  ...layout,
                  gap: [parseInt(val)],
                  horizontalGap: val as any
                }))} />
            <CUIToolbarSelect
              value={`${layout.verticalGap ? layout.verticalGap : 0}`}
              disabled={disabled}
              options={cdefTokens?.spacing}
              onChange={(val) => onUpdate(processLayoutObj({
                ...layout,
                verticalGap: val as any
              }))} />
            </div>
        </div>
        <div className='input-row'>
          <CUIToolbarLabel value="Alignment" disabled={disabled} />
          <div>
            <CUIToolbarSelect
              value={`${layout.verticalAlignment ? layout.verticalAlignment : 'top'}`}
              disabled={disabled}
              options={{
                'Top': 'top',
                'Center': 'center',
                'Bottom' : 'bottom'
              }}
              onChange={(val) => onUpdate(processLayoutObj({
                ...layout,
                verticalAlignment: val as any
              }))} />
            <CUIToolbarSelect
                value={`${layout.horizontalAlignment ? layout.horizontalAlignment : 'left'}`}
                disabled={disabled}
                options={{
                  'Left': 'left',
                  'Center': 'center',
                  'Right' : 'right'
                }}
                onChange={(val) => onUpdate(processLayoutObj({
                  ...layout,
                  horizontalAlignment: val as any
                }))} />
          </div>
        </div>
        <div className='input-row'>
          <CUIToolbarLabel value="Direction" disabled={disabled} />
          <CUIToolbarSelect
            value={`${layout.direction ? layout.direction : 'horizontal'}`}
            disabled={disabled}
            options={{
              'Horizontal': 'horizontal',
              'Vertical': 'vertical'
            }}
            onChange={(val) => onUpdate(processLayoutObj({
              ...layout,
              direction: val as any
            }))} />
        </div>
        <hr />
        {/* HORIZONTAL POSITIONING */}
        <div className='input-row'>
          <CUIToolbarLabel value="Width" disabled={disabled} />
          <div>
            <CUIToolbarSelect
              value={`${layout.horizontalResizing ? layout.horizontalResizing : 'fill'}`}
              disabled={disabled}
              options={{
                'Fixed': 'fixed',
                'Fill': 'fill',
                'Hug': 'hug'
              }}
              onChange={(val) => onUpdate(processLayoutObj({
                ...layout,
                horizontalResizing: val as any
              }))} />
            {layout.horizontalResizing === 'fixed' ? (<>
                <CUIToolbarInput
                  value={`${layout.width ? layout.width : 200}`}
                  type="number"
                  disabled={disabled}
                  textAlign='right'
                  onChange={(val) => onChange(processLayoutObj({
                    ...layout,
                    width: parseInt(val)
                  }))}
                  onUpdate={(val) => onUpdate(processLayoutObj({
                    ...layout,
                    width: parseInt(val)
                  }))} />
                <CUIToolbarSelect
                  className="size-unit"
                  value={`${layout.widthUnit ? layout.widthUnit : 'pixel'}`}
                  disabled={disabled}
                  options={{
                    'px': 'pixel',
                    '%': 'percent',
                  }}
                  onChange={(val) => onUpdate(processLayoutObj({
                    ...layout,
                    widthUnit: val as any
                  }))} />
            </>) : null}
            {layout.horizontalResizing === 'fill' ? (
                <CUIToolbarInput
                  className="fill-input"
                  value={`${layout.widthFill ? layout.widthFill : 1}`}
                  type="number"
                  disabled={disabled}
                  textAlign='right'
                  onChange={(val) => onChange(processLayoutObj({
                    ...layout,
                    widthFill: parseInt(val)
                  }))}
                  onUpdate={(val) => onUpdate(processLayoutObj({
                    ...layout,
                    widthFill: parseInt(val)
                  }))} />
            ) : null}
          </div>
        </div>

        {/* VERTICAL POSITIONING */}
        <div className='input-row'>
          <CUIToolbarLabel value="Height" disabled={disabled} />
          <div>
            <CUIToolbarSelect
              value={`${layout.verticalResizing ? layout.verticalResizing : 'hug'}`}
              disabled={disabled}
              options={{
                'Fixed': 'fixed',
                'Fill': 'fill',
                'Hug': 'hug'
              }}
              onChange={(val) => onUpdate(processLayoutObj({
                ...layout,
                verticalResizing: val as any
              }))} />
            {layout.verticalResizing === 'fixed' ? (<>
                <CUIToolbarInput
                  value={`${layout.height ? layout.height : 200}`}
                  type="number"
                  disabled={disabled}
                  textAlign='right'
                  onChange={(val) => onChange(processLayoutObj({
                    ...layout,
                    height: parseInt(val)
                  }))}
                  onUpdate={(val) => onUpdate(processLayoutObj({
                    ...layout,
                    height: parseInt(val)
                  }))} />
                <CUIToolbarSelect
                  className="size-unit"
                  value={`${layout.heightUnit ? layout.heightUnit : 'pixel'}`}
                  disabled={disabled}
                  options={{
                    'px': 'pixel',
                    '%': 'percent',
                  }}
                  onChange={(val) => onUpdate(processLayoutObj({
                    ...layout,
                    heightUnit: val as any
                  }))} />
            </>) : null}
            {layout.verticalResizing === 'fill' ? (
                <CUIToolbarInput
                  className="fill-input"
                  value={`${layout.heightFill ? layout.heightFill : 1}`}
                  type="number"
                  disabled={disabled}
                  textAlign='right'
                  onChange={(val) => onChange(processLayoutObj({
                    ...layout,
                    heightFill: parseInt(val)
                  }))}
                  onUpdate={(val) => onUpdate(processLayoutObj({
                    ...layout,
                    heightFill: parseInt(val)
                  }))} />
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`
      cui-toolbar-layout-row ${
      disabled ? 'disabled' : ''}`}>
      {inputs}
      <hr />
    </div>
  );
};

export default CUIToolbarLayoutRow;
