import React, { useCallback, useState, useEffect } from 'react';
import { ConfigAppSDK } from '@contentful/app-sdk';
import { Heading, Form, Flex, TextInput, FormControl, Stack, Button, Paragraph } from '@contentful/f36-components';
import { css } from 'emotion';
import { /* useCMA, */ useSDK } from '@contentful/react-apps-toolkit';
import CUIToolbarInput from '../../ctfl-ui-editor/toolbar-input/ToolbarInput';
import CUIToolbarLabel from '../../ctfl-ui-editor/toolbar-label/ToolbarLabel';
import tokens from '@contentful/f36-tokens';
import CUIToolbarHeader from '../../ctfl-ui-editor/toolbar-header/ToolbarHeader';
import CUIToolbarButton from '../../ctfl-ui-editor/toolbar-button/ToolbarButton';
import CUIToolbarInputRow from '../../ctfl-ui-editor/toolbar-input-row/ToolbarInputRow';
import CUIToolbarActionRow from '../../ctfl-ui-editor/toolbar-action-row/ToolbarActionRow';
import CUIToolbarSwitchRow from '../../ctfl-ui-editor/toolbar-switch-row/ToolbarSwitchRow';
import CUIToolbarSection from '../../ctfl-ui-editor/toolbar-section/ToolbarSection';
import CUIToolbarSlider from '../../ctfl-ui-editor/toolbar-slider/ToolbarSlider';
import CUIToolbarSliderRow from '../../ctfl-ui-editor/toolbar-slider-row/ToolbarSliderRow';

export interface AppInstallationParameters {
  // contentfulDisplayAccessKey?: string;
  // contentfulPreviewAccessKey?: string;
  // webComponentsJavascriptURL?: string;
  // webComponentsCssURL?: string;
  componentDefinitionManifestURL?: string;
}

const ConfigScreen = () => {
  const sdk = useSDK<ConfigAppSDK>();

  const [parameters, setParameters] = useState<AppInstallationParameters>({});
  const [showCWSUI, setShowCWSUI] = useState<Boolean>(false);

  /*
     To use the cma, inject it as follows.
     If it is not needed, you can remove the next line.
  */
  // const cma = useCMA();

  const onConfigure = useCallback(async () => {
    // This method will be called when a user clicks on "Install"
    // or "Save" in the configuration screen.
    // for more details see https://www.contentful.com/developers/docs/extensibility/ui-extensions/sdk-reference/#register-an-app-configuration-hook

    // Get current the state of EditorInterface and other entities
    // related to this app installation
    const currentState = await sdk.app.getCurrentState();

    setHasSubmited(true);

    console.log('parameters', parameters);
    return {
      // Parameters to be persisted as the app configuration.
      parameters,
      // In case you don't want to submit any update to app
      // locations, you can just pass the currentState as is
      targetState: currentState,
    };
  }, [parameters, sdk]);

  useEffect(() => {
    // `onConfigure` allows to configure a callback to be
    // invoked when a user attempts to install the app or update
    // its configuration.
    sdk.app.onConfigure(() => onConfigure());
  }, [sdk, onConfigure]);

  useEffect(() => {
    (async () => {
      // Get current parameters of the app.
      // If the app is not installed yet, `parameters` will be `null`.
      const currentParameters: AppInstallationParameters | null = await sdk.app.getParameters();
      if (currentParameters) {
        setParameters(currentParameters);
      }
      // Once preparation has finished, call `setReady` to hide
      // the loading screen and present the app to a user.
      sdk.app.setReady();
    })();
  }, [sdk]);

  const [hasSubmited, setHasSubmited] = useState(false);
  const [valExample, setValExample] = useState('Test');
  const [boolExample, setBoolExample] = useState(false);
  const [numberExample1, setNumberExample1] = useState(40);
  const [numberExample2, setNumberExample2] = useState(40);
  const [floatExample, setFloatExample] = useState(40.44);

  return (<>
    <Flex flexDirection="column" className={css({ margin: '80px', maxWidth: '800px' })}>
      <Form>
        <Heading>App Config</Heading>
        {/* <FormControl isRequired isInvalid={!parameters.webComponentsJavascriptURL && hasSubmited}>
          <FormControl.Label>Web Component Javascript URL</FormControl.Label>
          <TextInput
            value={parameters.webComponentsJavascriptURL || ''}
            type="text"
            name="webComponentsJavascriptURL"
            placeholder="Javascript URL"
            onChange={(evt) => {
              setParameters({
                ...parameters,
                webComponentsJavascriptURL: evt.target.value,
              });
            }}
          />
          <FormControl.HelpText>Needed to load your web components</FormControl.HelpText>
          {(!parameters.webComponentsJavascriptURL && hasSubmited ) ? (
            <FormControl.ValidationMessage>
              Please, provide your Web Component Javascript URL
            </FormControl.ValidationMessage>
          ) : ''}
        </FormControl> */}

        <FormControl isRequired isInvalid={!parameters.componentDefinitionManifestURL && hasSubmited}>
          <FormControl.Label>Component Definition Manifest URL (cDef)</FormControl.Label>
          <TextInput
            value={parameters.componentDefinitionManifestURL || ''}
            type="text"
            name="componentDefinitionManifestURL"
            placeholder="Manifest URL"
            onChange={(evt) => {
              setParameters({
                ...parameters,
                componentDefinitionManifestURL: evt.target.value,
              });
            }}
          />
          <FormControl.HelpText>Needed to create inputs for your component content types</FormControl.HelpText>
        </FormControl>
      </Form>
      <Paragraph style={{color: '#ccc'}}>https://web-components.colorfuldemo.com/cdef/manifest.json or http://localhost:1234/cdef/manifest.json</Paragraph>


      <Button
        variant="transparent"
        onClick={() => setShowCWSUI(!showCWSUI)}>
        CWC UI
      </Button>
      {showCWSUI ? (
        <Flex
          flexDirection="column"
          alignContent='stretch'
          gap={tokens.spacingXs}
          style={{width: 400}}>

          <Heading marginTop='spacingL'>
            CUIToolbarInput
          </Heading>
          <CUIToolbarInput
            value={valExample}
            onUpdate={() => console.log('onUpdate')}
            onChange={(val: string) => setValExample(val)} />
          <CUIToolbarInput value="Disabled" disabled />
          <CUIToolbarInput
            value={valExample}
            onChange={(val: string) => setValExample(val)}
            textAlign='right' />

          <Heading marginTop='spacing2Xl'>CUIToolbarLabel</Heading>
          <CUIToolbarLabel value='Toolbar Label' />
          <CUIToolbarLabel value='Toolbar Label Strong' strong />
          <CUIToolbarLabel value='Toolbar Label Disabled' disabled />
          <CUIToolbarLabel value='Toolbar Label Large' large />
          <CUIToolbarLabel value='Toolbar Label Large Strong' large strong />

          <Heading marginTop='spacing2Xl'>CUIToolbarHeader</Heading>
          <CUIToolbarHeader header='Header' subtitle='subtitle' />
          <CUIToolbarHeader header='Header' subtitle='subtitle' disabled />

          <Heading marginTop='spacing2Xl'>CUIToolbarButton</Heading>
          <Stack>
            <CUIToolbarButton label='test' />
            <CUIToolbarButton label='test' disabled />
          </Stack>

          <Heading marginTop='spacing2Xl'>CUIToolbarInputRow</Heading>
          <CUIToolbarInputRow label="label" value={valExample}
            onUpdate={() => console.log('onUpdate')}
            onChange={(val: string) => setValExample(val)} />
          <CUIToolbarInputRow label="label" value={valExample} disabled
            onUpdate={() => console.log('onUpdate')}
            onChange={(val: string) => setValExample(val)} />

          <Heading marginTop='spacing2Xl'>CUIToolbarActionRow</Heading>
          <CUIToolbarActionRow label="label" action="Do Something" />
          <CUIToolbarActionRow label="label" action="Do Something" disabled />

          <Heading marginTop='spacing2Xl'>CUIToolbarSwitchRow</Heading>
          <hr />
          <CUIToolbarSwitchRow label="label" value={boolExample}
            onChange={(val: boolean) => setBoolExample(val)} />
          <CUIToolbarSwitchRow label="label" value={boolExample} disabled />

          <Heading marginTop='spacing2Xl'>CUIToolbarSection</Heading>
          <CUIToolbarSection
            label='Name'
            onAddNew={() => console.log("onAddNew")} />
          <CUIToolbarSection
            label='Name' disabled />

          <Heading marginTop='spacing2Xl'>CUIToolbarSlider</Heading>
          <CUIToolbarSlider
            value={numberExample1} max={100} min={20}
            onChange={(val: number) => {
              console.log('onChange val', val);
              setNumberExample1(val);
            }} />
          <CUIToolbarSlider
            value={floatExample} max={100} min={20}
            roundValue={false}
            onUpdate={(val: number) => {
              console.log('onChange val', val);
              setFloatExample(val);
            }} />
          <CUIToolbarSlider
            value={floatExample} max={100} min={20}
            onChange={(val: number) => {
              console.log('onChange val', val);
              setFloatExample(val);
            }} />
          <CUIToolbarSlider
            value={numberExample2} max={10} min={0}
            onChange={(val: number) => {
              console.log('onChange val', val);
              setNumberExample2(val);
            }} />
          <CUIToolbarSlider
            value={numberExample2} max={10} min={0}
            snapToTick={true}
            onChange={(val: number) => {
              console.log('onChange val', val);
              setNumberExample2(val);
            }} />

          <Heading marginTop='spacing2Xl'>CUIToolbarSliderRow</Heading>
          <CUIToolbarSliderRow
            label='Slider Row'
            value={floatExample} max={100} min={20}
            onUpdate={(val: number) => {
              setFloatExample(val);
            }} />

        </Flex>
      ) : ''}
      
    </Flex>
  </>);
};

export default ConfigScreen;
