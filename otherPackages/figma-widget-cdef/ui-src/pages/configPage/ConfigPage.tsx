import React, { useState, useEffect } from "react";
import CUIToolbarInputRow from "../../ctfl-ui-editor/toolbar-input-row/ToolbarInputRow.js";
import CUIToolbarButton from "../../ctfl-ui-editor/toolbar-button/ToolbarButton.js";
import { Flex, Spinner } from '@contentful/f36-components';
import postMessagePromise from "../../utils/postMessagePromise.js";
import * as contentful from 'contentful-management';
import { MessageRequest } from "../../../shared-src/types.js";
import CUIToolbarLabel from "../../ctfl-ui-editor/toolbar-label/ToolbarLabel.js";
import CUIToolbarSelectRow from "../../ctfl-ui-editor/toolbar-select-row/ToolbarSelectRow.js";
import './ConfigPage.scss';

const ConfigPage = (
    args: {
        cDefRootUrl: string | undefined,
        ctflCMAKey: string | undefined,
        ctflCPAKey: string | undefined,
        organizationId: string | undefined,
        spaceId: string | undefined,
        environmentId: string | undefined,
        configUpdate: (
            cDefRootUrl: string | undefined,
            ctflCMAKey: string | undefined,
            ctflCPAKey: string | undefined,
            organizationId: string | undefined,
            spaceId: string | undefined,
            environmentId: string | undefined,
        ) => void,
        invalidate: () => void
    }
) => {

    const {
        cDefRootUrl,
        ctflCMAKey,
        ctflCPAKey,
        organizationId,
        spaceId,
        environmentId,
        configUpdate,
        invalidate
    } = args;

    const [localCdefRootUrl, setLocalCdefRootUrl] = useState<string | undefined>(cDefRootUrl);
    const [localCtflCMAKey, setLocalCtflMAKey] = useState<string | undefined>(ctflCMAKey);
    const [localCtflCPAKey, setLocalCtflCPAKey] = useState<string | undefined>(ctflCPAKey);
    const [localOrganizationId, setLocalOrganizationId] = useState<string | undefined>(organizationId);
    const [localSpaceId, setLocalSpaceId] = useState<string | undefined>(spaceId);
    const [localEnvironmentId, setLocalEnvironmentId] = useState<string | undefined>(environmentId);

    const [organizations, setOrganizations] = useState<{[key:string]: string} | undefined>();
    const [spaces, setSpaces] = useState<{[key:string]: string} | undefined>();
    const [environments, setEnvironments] = useState<{[key:string]: string} | undefined>();

    const [loadingContentful, setLoadingContentful] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>();

    const zeroOutContentful = () => {
        setOrganizations(undefined);
        setLocalOrganizationId(undefined);
        setSpaces(undefined);
        setLocalSpaceId(undefined);
        setEnvironments(undefined);
        setLocalEnvironmentId(undefined);
        setLoadingContentful(false);
    };

    useEffect(() => {
        if (ctflCMAKey) {
            (async() => {
                setLoadingContentful(true);
                setError(undefined);

                const zeroOutContentful = () => {
                    setOrganizations(undefined);
                    setLocalOrganizationId(undefined);
                    setSpaces(undefined);
                    setLocalSpaceId(undefined);
                    setEnvironments(undefined);
                    setLocalEnvironmentId(undefined);
                    setLoadingContentful(false);
                }

                if (!localCtflCMAKey) {
                    zeroOutContentful();
                    return;
                }

                const client = contentful.createClient({
                    accessToken: localCtflCMAKey
                });

                if (!client) {
                    zeroOutContentful();
                    return;
                }

                if (!organizations) {
                    const orgsResults = await client.getOrganizations().catch(
                        err => {
                            setError(JSON.parse(err.message).message);
                            zeroOutContentful();
                        }
                    );
                    if (orgsResults && orgsResults.total > 0) {
                        const orgSelections: {[key:string]: string} = {"Choose Org": ''};
                        orgsResults.items.map(org => {
                            orgSelections[org.name] = org.sys.id;
                        });
                        setOrganizations(orgSelections);
                    }
                }

                if (!spaces && localOrganizationId) {
                    const org = await client.getOrganization(localOrganizationId);
                    const spacesResults = await org.getSpaces();
                    if (spacesResults && spacesResults.total > 0) {
                        const spaceSelections: {[key:string]: string} = {"Choose Space": ''};
                        spacesResults.items.map(space => {
                            spaceSelections[space.name] = space.sys.id;
                        });
                        setSpaces(spaceSelections);
                    }
                }

                if (!environments && localSpaceId) {
                    const space = await client.getSpace(localSpaceId);
                    const envResults = await space.getEnvironments();
                    if (envResults && envResults.total > 0) {
                        const environmentSelections: {[key:string]: string} = {"Choose Environment": ''};
                        envResults.items.map(env => {
                            environmentSelections[env.name] = env.sys.id;
                        });
                        setEnvironments(environmentSelections);
                    }
                }

                setLoadingContentful(false);
            })();
        }
    }, [
        localCtflCMAKey,
        ctflCPAKey,
        organizations,
        setOrganizations,
        localEnvironmentId,
        spaces,
        setSpaces,
        localSpaceId,
        environments,
        setEnvironments,
        setLoadingContentful
    ]);
  
    return (
        <Flex
            className="config-page"
            flexDirection="column"
            padding="spacingM">
            <Flex
                flexDirection="column"
                padding="none"
                style={{
                    maxWidth: 400,
                    width: '100%',
                    alignSelf: 'center'
                }}>
                <CUIToolbarInputRow 
                    label="Comp Definitions Folder"
                    value={localCdefRootUrl}
                    textAlign="left"
                    onChange={(val: React.SetStateAction<string | undefined>) => setLocalCdefRootUrl(val)}
                    onUpdate={(val: React.SetStateAction<string | undefined>) => setLocalCdefRootUrl(val)} />
                <CUIToolbarInputRow
                    label="Contentful CMA Key"
                    textAlign="left"
                    type="password"
                    value={localCtflCMAKey}
                    onChange={(val: React.SetStateAction<string | undefined>) => {
                        setLocalCtflMAKey(val);
                    }}
                    onUpdate={(val: React.SetStateAction<string | undefined>) => {
                        setLocalCtflMAKey(val);
                        zeroOutContentful();
                    }} />
                <CUIToolbarInputRow
                    label="Contentful CPA Key"
                    textAlign="left"
                    value={localCtflCPAKey}
                    type="password"
                    onChange={(val: React.SetStateAction<string | undefined>) => setLocalCtflCPAKey(val)}
                    onUpdate={(val: React.SetStateAction<string | undefined>) => setLocalCtflCPAKey(val)} />
                <CUIToolbarLabel
                    medium strong
                    value="Contentful Location" />
                {organizations ? (
                    <CUIToolbarSelectRow
                        label="Organization"
                        value={localOrganizationId}
                        options={organizations}
                        onChange={(val: React.SetStateAction<string | undefined>) => {
                            setLocalOrganizationId(val);
                            // zero out everything below
                            setSpaces(undefined);
                            setLocalSpaceId(undefined);
                            setEnvironments(undefined);
                            setLocalEnvironmentId(undefined);
                        }} />
                ) : (
                    <CUIToolbarLabel
                        value="Need a valid CMA key" />
                )}
                {spaces ? (
                    <CUIToolbarSelectRow
                        label="Space"
                        value={localSpaceId}
                        options={spaces}
                        onChange={(val: React.SetStateAction<string | undefined>) => {
                            setLocalSpaceId(val);
                            // zero out everything below
                            setEnvironments(undefined);
                            setLocalEnvironmentId(undefined);
                        }} />
                ) : ''}
                {environments ? (
                    <CUIToolbarSelectRow
                        label="Environment"
                        value={localEnvironmentId}
                        options={environments}
                        onChange={(val: React.SetStateAction<string | undefined>) => {
                            setLocalEnvironmentId(val);
                        }} />
                ) : ''}
                {loadingContentful ? (
                    <Spinner />
                ) : ''}
                <Flex
                    flexDirection="row"
                    marginTop="spacingXs">
                    <CUIToolbarButton
                        label="Delete All"
                        onClick={async () => {
                            await postMessagePromise(MessageRequest.clearAllStorage);
                            invalidate();
                        }} />
                    <div style={{flex: 1}}></div>
                    <CUIToolbarButton label="Save"
                        onClick={() => {
                            // https://web-components.colorfuldemo.com/cdef
                            // http://localhost:1234/cdef
                            configUpdate(
                                localCdefRootUrl,
                                localCtflCMAKey,
                                localCtflCPAKey,
                                localOrganizationId,
                                localSpaceId,
                                localEnvironmentId
                            );
                        }} />
                </Flex>
                <div className="error-display">
                    {error}
                </div>
            </Flex>
        </Flex>
    );
}

export default ConfigPage;
