import React, { useEffect, useState } from 'react';
import {
  IconButton,
  Spinner
} from '@contentful/f36-components';
import "./Field.scss";
import {
  CycleIcon,
  MoreHorizontalIcon,
  CodeIcon
} from '@contentful/f36-icons';
import {
  EntrySys,
  FieldAppSDK,
  NavigatorSlideInfo
} from '@contentful/app-sdk';
import { useSDK } from '@contentful/react-apps-toolkit';
import saveEntry from './utils/saveEntry';
import initializeField from './utils/initializeField';
import ConfigModal from './configModal/ConfigModal';
import {
  CDefInstance,
  CDefDefinition,
  CDefManifestDefinition,
  CDefTokens
} from '@contentful-demos/component-definitions';
import CUIToolbarHeader from '../../ctfl-ui-editor/toolbar-header/ToolbarHeader';
import WebCompForm from './webCompForm/WebCompForm';
import { EntryProps, KeyValueMap } from 'contentful-management';
import WebCompExamples from './webCompExamples/webCompExamples';
import CUIToolbarLabel from '../../ctfl-ui-editor/toolbar-label/ToolbarLabel';

const Field = () => {
  const sdk = useSDK<FieldAppSDK>();

  const [configOpen, setConfigOpen] = useState<boolean>(false);
  const [entry, setEntry] = useState<EntryProps<KeyValueMap> | undefined>();
  const [showBoundFields, setShowBoundFields] = useState<boolean>(false);
  const [showInstanceJson, setShowInstanceJson] = useState<boolean>(false);
  const [invalidate, setInvalidate] = useState<number>(0);
  const [invalidateEntry, setInvalidateEntry] = useState<number>(0);

  const [componentDefinition, setComponentDefinition] = useState<CDefDefinition | undefined>();
  const [componentInstance, setComponentInstance] = useState<CDefInstance | undefined>();
  const [manifestDefinition, setManifestDefinition] = useState<CDefManifestDefinition | undefined>();
  const [cdefTokens, setCdefTokens] = useState<CDefTokens | undefined>();

  useEffect(() => {
    sdk.window.startAutoResizer();
    // takes care of any changes with slide in navs
    sdk.navigator.onSlideInNavigation((slide: NavigatorSlideInfo) => {
      setInvalidate(val => val+1);
    });
  }, [
    sdk,
  ]);

  useEffect(() => {
    sdk.entry.onSysChanged((sys: EntrySys) => {
      setInvalidate(val => val+1);
    });
  }, [sdk, setInvalidateEntry]);

  useEffect(() => {
    if (entry?.sys.updatedAt !== sdk.entry.getSys().updatedAt) {
      console.log("SYS CHANGE TRIGGERED", entry?.sys.updatedAt, sdk.entry.getSys().updatedAt)
      setInvalidate(val => val+1);
    }
  }, [sdk, entry, invalidateEntry, setInvalidate]);

  useEffect(() => {
    (async () => {
      await initializeField(
        sdk.cma,
        sdk.parameters.installation.componentDefinitionManifestURL,
        sdk.ids.entry,
        setEntry,
        setComponentDefinition,
        setComponentInstance,
        setManifestDefinition,
        setCdefTokens
      );
    })();
  }, [
    sdk,
    setEntry,
    setComponentDefinition,
    setComponentInstance,
    setManifestDefinition,
    setCdefTokens,
    invalidate
  ]);

  const webCompsUrl = new URL(sdk.parameters.installation.componentDefinitionManifestURL);

  if (!componentDefinition && !componentInstance) {
    return (
      <div>
        <Spinner /> 
      </div>
    );
  }
  return (
    <div style={{
        minHeight: configOpen ? 400 : 'unset',
        paddingRight: 3, // focus halo being clipped by iframe
      }}>
      <style>{`html, body { overflow: hidden }`}</style>
      {!componentInstance && manifestDefinition && componentDefinition ? (
        <WebCompExamples
          manifestUrl={sdk.parameters.installation.componentDefinitionManifestURL}
          examples={manifestDefinition.examples}
          entryId={sdk.ids.entry}
          cma={sdk.cma}
          setComponentInstance={setComponentInstance}
          componentDefinition={componentDefinition} />
      ) : (<>
        {configOpen ? (
          <ConfigModal
            setConfigOpen={setConfigOpen}
            showBoundFields={showBoundFields}
            setShowBoundFields={setShowBoundFields}
            sdk={sdk}
            reset={async () => {
              await saveEntry(sdk.cma, sdk.ids.entry, undefined);
              setComponentInstance(undefined);
              setTimeout(() => setInvalidate(val => val+1), 300);// tick
              setConfigOpen(false);
            }} />
        ) : ''}
        <CUIToolbarHeader
          header={componentDefinition ? componentDefinition['x-cdef']?.tag : 'unknown'}
          subtitle={''}>
          <IconButton
            icon={<CycleIcon />}
            size="small"
            aria-label='Reload Page' 
            onClick={async () => {
              window.location.reload();
            }}/>
          <IconButton
            icon={<MoreHorizontalIcon />}
            size="small"
            aria-label='Show Configuration'
            onClick={async () => {
              setConfigOpen(true);
            }}/>
        </CUIToolbarHeader>
        {componentDefinition ? (
          <WebCompForm
            showBoundFields={showBoundFields}
            entryId={sdk.ids.entry}
            entry={entry}
            componentDefinition={componentDefinition}
            componentInstance={componentInstance}
            cdefTokens={cdefTokens}
            setComponentInstance={setComponentInstance} />
        ) : ''}
      </>)}
      
      <div className="field-debug-box">
        <div className="field-debug">
          app host: {document.location.hostname}<br/>
          web comp host: {webCompsUrl.hostname}<br/>
          manifest:${sdk.parameters.installation.componentDefinitionManifestURL}
        </div>
        <IconButton
            icon={<CodeIcon />}
            size="small"
            aria-label='Show Hidden Fields'
            onClick={async () => {
              setShowInstanceJson(val => !val);
            }}/>
      </div>
      {showInstanceJson ? (
        <div className="field-instance-json-box">
          <CUIToolbarLabel
            strong
            value="Instance JSON" />
          <pre className="field-instance-json">
            {JSON.stringify(componentInstance, null , 4)}
          </pre>
        </div>
      ) : ''}
      
    </div>
  );
};

export default Field;
