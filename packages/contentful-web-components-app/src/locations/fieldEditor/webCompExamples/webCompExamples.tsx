import React from 'react';
import './webCompExamples.scss';
import CUIToolbarLabel from '../../../ctfl-ui-editor/toolbar-label/ToolbarLabel';
import { Flex, IconButton } from '@contentful/f36-components';
import {
  CycleIcon
} from '@contentful/f36-icons';
import {
  CDefDefinition,
  CDefExample,
  CDefInstance
} from '@contentful-demos/component-definitions';
import saveEntry from '../utils/saveEntry';
import { CMAClient } from '@contentful/app-sdk';
import { getComponentExample } from '../utils/getComponentDefinition';
import getLatestInstance from '../utils/getLatestInstance';

const webCompExamples = (
  args: {
    manifestUrl: string,
    examples: CDefExample[],
    cma: CMAClient,
    entryId?: string,
    setComponentInstance: (val: CDefInstance) => void,
    componentDefinition: CDefDefinition,
  }
) => { 
  const {
    manifestUrl,
    examples,
    cma,
    entryId,
    setComponentInstance,
    componentDefinition
  } = args;

  if (!entryId) {
    return (
      <div className="wc-examples">
        <CUIToolbarLabel
          strong medium
          value="Error: no entry id was pass to examples"
          noSelect
          marginBottom='xs' />
      </div>
    );
  }

  return (
    <div className="wc-examples">
      <Flex
        flexDirection='row'
        alignItems='center'
        style={{marginBottom: 'var( --ctfl-spacing-xs )'}}>
        <CUIToolbarLabel
          strong medium
          value="Which example would you like to build from?"
          noSelect />
        <IconButton
          icon={<CycleIcon />}
          aria-label='Reload Page' 
          onClick={async () => {
            window.location.reload();
          }}/>
      </Flex>
      <div className="examples">
        {examples.map((example: CDefExample)  => (
          <button
            className="wc-example"
            key={example.name}
            onClick={async () => {
              const exampleInst = await getComponentExample(
                manifestUrl,
                example
              );
              saveEntry(
                cma, entryId, exampleInst
              );
              setComponentInstance(exampleInst);
            }}>
            <div className="name">
              {example.name}
            </div>
            <div className="description">
              {example.description}
            </div>
          </button>
        ))}
        <button
            className="wc-example"
            onClick={() => {
              // create a fully defaulted instance
              let finalEntryInst: CDefInstance = getLatestInstance(
                componentDefinition
              );
              saveEntry(
                cma, entryId, finalEntryInst
              );
              setComponentInstance(finalEntryInst);
            }}>
            <div className="name">
              New Design
            </div>
            <div className="description">
              Build from scratch
            </div>
          </button>
      </div>
    </div>
  );
};

export default webCompExamples;
