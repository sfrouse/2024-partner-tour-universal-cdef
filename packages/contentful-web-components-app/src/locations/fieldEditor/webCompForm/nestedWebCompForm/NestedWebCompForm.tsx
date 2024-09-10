import React, { useEffect, useState } from 'react';
import { Entry, EntryProps, KeyValueMap } from 'contentful-management';
import { useSDK } from '@contentful/react-apps-toolkit';
import { FieldAppSDK } from '@contentful/app-sdk';
import initializeField from '../../utils/initializeField';
import getEntryTitle from '../../utils/getEntryTitle';
import './NestedWebCompForm.scss';
import {
    CDefDefinition,
    CDefInstance,
    CDefManifestDefinition,
    CDefTokens
} from '@contentful-demos/component-definitions';
import WebCompExamples from '../../webCompExamples/webCompExamples';
import WebCompForm from '../WebCompForm';
import ToolbarReadOnlyRow from '../../../../ctfl-ui-editor/toolbar-read-only-row/ToolbarReadOnlyRow';
import CUIToolbarLabel from '../../../../ctfl-ui-editor/toolbar-label/ToolbarLabel';
import CUIToolbarHeader from '../../../../ctfl-ui-editor/toolbar-header/ToolbarHeader';
import { EntryIcon, ChevronDownTrimmedIcon, ChevronRightTrimmedIcon } from '@contentful/f36-icons';
import { IconButton } from '@contentful/f36-components';

const NestedWebCompForm = (
    args: {
        entryLink: Entry,
        name?: string,
        showBoundFields: boolean,
        // invalidate: number
    }
) => {
    const sdk = useSDK<FieldAppSDK>();

    const {
        entryLink,
        name,
        showBoundFields,
        // invalidate
    } = args;

    const [open, setOpen] = useState<boolean>(false);
    const [entry, setEntry] = useState<EntryProps<KeyValueMap> | undefined>();
    const [componentDefinition, setComponentDefinition] = useState<CDefDefinition | undefined>();
    const [componentInstance, setComponentInstance] = useState<CDefInstance | undefined>();
    const [manifestDefinition, setManifestDefinition] = useState<CDefManifestDefinition | undefined>();
    const [cdefTokens, setCdefTokens] = useState<CDefTokens | undefined>();

    useEffect(() => {
        (async () => {
        await initializeField(
            sdk.cma,
            sdk.parameters.installation.componentDefinitionManifestURL,
            entryLink.sys.id,
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
        entryLink,
        // invalidate
    ]);

    if (!entryLink) return '';

    if (
        entryLink.sys.type === 'Link' &&
        ( entryLink.sys as any).linkType === 'Entry'
    ) {
        return (
            <div className='nested-web-comp-form'>
                {name ? (<CUIToolbarLabel value={name} />) : ''}
                <div className='web-comp-form'>
                    <CUIToolbarHeader
                        header={getEntryTitle(entry)}
                        subtitle={
                            componentDefinition &&
                            componentDefinition['x-cdef'] &&
                            componentDefinition['x-cdef'].tag ? 
                            componentDefinition['x-cdef'].tag : ''}
                        onClick={() => {
                            setOpen(!open);
                        }}>
                        <IconButton
                            variant="transparent"
                            size="small"
                            aria-label="View Component Detail"
                            icon={<EntryIcon size="tiny" />}
                            onClick={async () => {
                                const done = await sdk.navigator.openEntry(
                                    entryLink.sys.id,
                                    {slideIn: {waitForClose: true}}
                                );
                                console.log('DONE', done);
                            }} />
                        <IconButton
                            variant="transparent"
                            size="small"
                            aria-label="Component is open or closed"
                            icon={open ?
                                <ChevronDownTrimmedIcon size="tiny" /> :
                                <ChevronRightTrimmedIcon size="tiny" />
                            }onClick={() => {
                                setOpen(!open);
                            }} />
                    </CUIToolbarHeader>
                    {!open ? '' : 
                        !componentInstance && manifestDefinition && componentDefinition ? (
                            <WebCompExamples
                                manifestUrl={sdk.parameters.installation.componentDefinitionManifestURL}
                                examples={manifestDefinition.examples}
                                entryId={entry?.sys.id}
                                cma={sdk.cma}
                                setComponentInstance={setComponentInstance}
                                componentDefinition={componentDefinition} />
                        ) : componentDefinition && entry ? (
                            <WebCompForm
                                showBoundFields={showBoundFields}
                                entryId={entry?.sys.id}
                                entry={entry}
                                componentDefinition={componentDefinition}
                                componentInstance={componentInstance}
                                cdefTokens={cdefTokens}
                                setComponentInstance={setComponentInstance} />
                        ) : ''
                    }
                </div>
            </div>
        );
    }

    // else it's just an alias for another field...
    return (
        <ToolbarReadOnlyRow
            key={name}
            label={'unknown nested web comp'}
            value={``} />
      );
};

export default NestedWebCompForm;
