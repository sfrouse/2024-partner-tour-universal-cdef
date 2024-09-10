import React from 'react';
import { Paragraph } from '@contentful/f36-components';
import { EditorAppSDK } from '@contentful/app-sdk';
import { useSDK } from '@contentful/react-apps-toolkit';
// import { Field, FieldWrapper } from '@contentful/default-field-editors';
// import { editorInterfaceDefaults } from 'contentful-management';

const Entry = () => {
  const sdk = useSDK<EditorAppSDK>();
  /*
     To use the cma, inject it as follows.
     If it is not needed, you can remove the next line.
  */
  // const cma = useCMA();

  // console.log('sdk', sdk);
  // console.log('useFieldValue', useFieldValue(sdk.contentType.fields[0]?.id));

  // const myField = editorInterfaceDefaults.default.getDefaultControlOfField(sdk.contentType.fields[0]);
  // // console.log('myField', myField);

  return (
    <Paragraph>
      Hello Entry Editor Component (AppId: {sdk.ids.app})
      {/* {Object.entries(sdk.entry.fields).map(entry => {
        const name = entry[0];
        const value = entry[1];
        const sdkCast: FieldAppSDK  = {
          ...sdk,
          field: sdk.entry.fields[name].getForLocale('en-US')
        } as FieldAppSDK;
        const contentTypeField = sdk.editor.editorInterface.controls?.find(control => control.fieldId === value.id);
        if (!contentTypeField) return (<div>no control</div>);
        return (
          <FieldWrapper sdk={sdkCast} name={value.name}>
            <Field sdk={sdkCast} widgetId={contentTypeField.widgetId}/>
          </FieldWrapper>
        );
      })} */}
      
    </Paragraph>
  );
};

export default Entry;
