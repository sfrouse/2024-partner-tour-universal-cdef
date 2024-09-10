import React from 'react';
import saveEntry from '../utils/saveEntry';
import { useSDK } from '@contentful/react-apps-toolkit';
import touchEntry from '../utils/touchEntry';
import { FieldAppSDK } from '@contentful/app-sdk';
import "./WebCompForm.scss";
import CUIToolbarInputRow from '../../../ctfl-ui-editor/toolbar-input-row/ToolbarInputRow';
import CUIToolbarSwitchRow from '../../../ctfl-ui-editor/toolbar-switch-row/ToolbarSwitchRow';
import CUIToolbarSelectRow from '../../../ctfl-ui-editor/toolbar-select-row/ToolbarSelectRow';
import CUIToolbarSliderRow from '../../../ctfl-ui-editor/toolbar-slider-row/ToolbarSliderRow';
import ToolbarReadOnlyRow from '../../../ctfl-ui-editor/toolbar-read-only-row/ToolbarReadOnlyRow';
import {
  CDefInstance,
  CDefDefinition,
  CDefTokens,
  CDefDesignPropertyEnum,
  propertyHasOneExternalRef
} from '@contentful-demos/component-definitions/dist';
import NestedWebCompForm from './nestedWebCompForm/NestedWebCompForm';
import { EntryProps, KeyValueMap } from 'contentful-management';
import CUIToolbarActionRow from '../../../ctfl-ui-editor/toolbar-action-row/ToolbarActionRow';
// import CUIToolbarSpacingRow from '../../../ctfl-ui-editor/toolbar-spacing-row/ToolbarSpacingRow';
import CUIToolbarLayoutRow from '../../../ctfl-ui-editor/toolbar-layout-row/ToolbarLayoutRow';

const WebCompForm = (
  args: {
    showBoundFields: boolean,
    entryId: string,
    entry: EntryProps<KeyValueMap> | undefined,
    componentDefinition: CDefDefinition | undefined,
    componentInstance: CDefInstance | undefined,
    cdefTokens: CDefTokens | undefined,
    setComponentInstance: (val: CDefInstance | undefined) => void
  }
) => {
  const {
    showBoundFields = false,
    entryId,
    entry,
    componentDefinition,
    componentInstance,
    cdefTokens,
    setComponentInstance,
  } = args;
  const sdk = useSDK<FieldAppSDK>();

  let properties: [key: string, obj: CDefDefinition][] = [];
  if (componentDefinition && componentDefinition.properties) {
    properties = Object.entries(componentDefinition.properties);
  }

  return (
    <div className='entry-wc-form'>
      {properties.map((propertyInfo) => {
        const name = propertyInfo[0];
        const property = propertyInfo[1];
        const value = componentInstance ? componentInstance[name] : undefined;
        if (name === "$schema" || name === '$identifier') return '';
        if (!property['x-cdef'] || !property['x-cdef'].input || !property['x-cdef'].output) {
          return (<div key={name}>cdef info missing ({name})</div>);
        }

        const input = property['x-cdef'].input;
        const output = property['x-cdef'].output;
        const isContent = output.content?.content === true ? true: false;
        const isHidden = property['x-cdef'].hidden === true;
        if (isHidden) return true;
        const label = input.label || '';
        const inputType = input.inputType;
        const options = input.options;
        const update = (val: any) => {
          const newInst = {
            ...componentInstance,
            [name]: val
          };
          setComponentInstance(newInst);
          return newInst;
        }
        const save = (val: any) => {
          saveEntry(sdk.cma, entryId, update(val));
          if (entryId !== sdk.ids.entry) touchEntry(sdk.cma, sdk.ids.entry);
        }

        if (isContent) {
          // if it has a ref (and not an intrinsic one) then we can open a nested version
          if (entry && propertyHasOneExternalRef(property)) {
            const entryProp = entry.fields[name] ? entry.fields[name]['en-US'] : undefined;
            if (Array.isArray(entryProp)) {
              return (
                entryProp.map((childEntryProp, index) => {
                  if (
                    childEntryProp &&
                    childEntryProp.sys?.type === 'Link' &&
                    childEntryProp.sys?.linkType === 'Entry'
                  ) {
                    return (
                      <NestedWebCompForm
                        key={childEntryProp.sys.id}
                        entryLink={childEntryProp}
                        name={index === 0 ? name : ''}
                        showBoundFields={showBoundFields} />
                    );
                  }
                  return '';
                })
              );
            }else{
              if (
                entryProp &&
                entryProp.sys?.type === 'Link' &&
                entryProp.sys?.linkType === 'Entry'
              ) {
                return (
                  <NestedWebCompForm
                    key={entryProp.sys.id}
                    entryLink={entryProp}
                    name={name}
                    showBoundFields={showBoundFields} />
                );
              }

              // we are still content
              if (!entryProp && value !== undefined) {
                return (
                  <CUIToolbarActionRow
                    key={name}
                    label={label}
                    action='Clear Default Value'
                    onAction={() => save(undefined)} />
                );
              }
            }
          }

          if (showBoundFields) {
            return (
              <ToolbarReadOnlyRow
                key={name}
                label={label}
                value={`${inputType === 'unknown' ? 'unknown entry, ' : ''}content`} />
            );
          }else{
            return '';
          }
        }

        switch (inputType) {
          case "string" :
          case "number" :
            return (
              <CUIToolbarInputRow
                key={name}
                label={label}
                value={value !== undefined ? String(value) : ''}
                type='string'
                disabled={isContent}
                onChange={update}
                onUpdate={save} />
            );
          case "boolean" :
            return (
              <CUIToolbarSwitchRow
                key={name}
                label={label}
                value={value === 'true' || value === true ? true : false}
                disabled={isContent}
                onChange={save} />
            );
          case "select" :
              return (
                <CUIToolbarSelectRow
                  key={name}
                  label={label}
                  value={String(value)}
                  disabled={isContent}
                  options={options}
                  onChange={save} />
              );
          case "slider" :
            return (
              <CUIToolbarSliderRow
                key={name}
                label={label}
                value={Number(value)}
                max={property.maximum || 100}
                min={property.minimum || 0}
                disabled={isContent}
                onChange={update}
                onUpdate={save} />
            );
          case "layout" :
            return (
              <CUIToolbarLayoutRow
                key={name}
                label={label}
                value={value}
                disabled={isContent}
                cdefTokens={cdefTokens}
                onChange={update}
                onUpdate={save} />
            );
          case "unknown" :
            return (
              <ToolbarReadOnlyRow
                key={name}
                label={label}
                value={'unknown input'} />
            );
          case CDefDesignPropertyEnum.backgroundColor :
          case CDefDesignPropertyEnum.textColor :
          case CDefDesignPropertyEnum.typography :
            return (
              <CUIToolbarSelectRow
                  key={name}
                  label={label}
                  value={String(value)}
                  disabled={isContent}
                  options={cdefTokens?.[inputType]}
                  onChange={save} />
            );
          case CDefDesignPropertyEnum.containment :
            return (
              <CUIToolbarLayoutRow
                key={name}
                label={label}
                value={value}
                disabled={isContent}
                cdefTokens={cdefTokens}
                onChange={update}
                onUpdate={save} />
            );
          case CDefDesignPropertyEnum.textAlign :
            return (
              <CUIToolbarSelectRow
                  key={name}
                  label={label}
                  value={String(value)}
                  disabled={isContent}
                  options={{'Left': 'left', 'Center': 'center', 'Right': 'right'}}
                  onChange={save} />
            );
          case CDefDesignPropertyEnum.position :
            return (
              <CUIToolbarSelectRow
                  key={name}
                  label={label}
                  value={String(value)}
                  disabled={isContent}
                  options={{'Relative': 'relative', 'Absolute': 'absolute'}}
                  onChange={save} />
            );
        }

        return (
          <ToolbarReadOnlyRow
                key={name}
                label={label}
                value={`unknown type, inputType: ${inputType}`} />
        );
      })}
    </div>
  );
};

export default WebCompForm;
