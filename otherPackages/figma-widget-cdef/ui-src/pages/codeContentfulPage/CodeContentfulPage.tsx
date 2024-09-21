import React, { useState } from "react";
import { Flex, Spinner, ToggleButton } from '@contentful/f36-components';
import './CodeContentfulPage.scss';
import CUIToolbarButton from "../../ctfl-ui-editor/toolbar-button/ToolbarButton.js";
import * as contentful from 'contentful';
import { ExternalLinkIcon } from '@contentful/f36-icons';
import {
    CDefInstance,
} from "@contentful-demos/component-definitions/dist/index.js";
import CUIToolbarLabel from "../../ctfl-ui-editor/toolbar-label/ToolbarLabel.js";
import updateEntries from "./utils/updateEntries.js";
import postMessagePromise from "../../utils/postMessagePromise.js";
import { MessageRequest } from "../../../shared-src/types.js";

const CodeContentfulPage = (
    args: {
        cdefInstance: CDefInstance,
        ctflCMAKey: string | undefined,
        ctflCPAKey: string | undefined,
        spaceId: string | undefined,
        environmentId: string | undefined,
        cDefRootUrl: string | undefined,
    }
) => {
  
    const {
        cdefInstance,
        ctflCMAKey,
        ctflCPAKey,
        spaceId,
        environmentId,
        cDefRootUrl
    } = args;

    const [cacheBust, setCacheBust] = useState<number>(Date.now());
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const entryId = cdefInstance?.$identifier ? cdefInstance.$identifier['contentful'] : '';

    return (
        <Flex 
            className="code-page"
            flexDirection="column"
            padding="spacingM"
            style={{position: "relative"}}
            gap="spacingS">
            <Flex alignItems="center" justifyContent="center"
                style={{
                    position: "absolute",
                    display: isLoading ? 'flex' : 'none',
                    top: 0, right: 0, bottom: 0, left: 0,
                    backgroundColor: 'rgba(255,255,255,0.8)'
                }}>
                <Spinner />
            </Flex>
            {entryId ? (
                <iframe src={`http://localhost:1234/preview?entry_id=${
                    entryId
                }&contentful_space_id=${
                    spaceId
                }&contentful_environment_id=${
                    environmentId
                }&contentful_access_token=${
                    ctflCPAKey
                }&${cacheBust}`} />
            ) : (
                <div className="no-contentful-entry">
                    <div>No Contentful Entry</div>
                    <CUIToolbarButton
                        label="Create Entry"
                        onClick={async () => {
                            if (!ctflCMAKey || !spaceId || !ctflCPAKey || !environmentId || !cdefInstance || !cDefRootUrl) return;
                            setIsLoading(true);
                            const newEntry = await updateEntries(
                                cdefInstance,
                                ctflCMAKey,
                                spaceId,
                                environmentId,
                                cDefRootUrl
                            );
                            if (!newEntry) {
                                console.error('something wrong creating entry');
                                setIsLoading(false);
                                return;
                            }
                            const client = contentful.createClient({
                                space: spaceId,
                                environment: environmentId,
                                accessToken: ctflCPAKey,
                                host: 'preview.contentful.com'
                            });
                            const entry = await client.getEntry(newEntry?.sys.id, {include: 10});
                            await postMessagePromise(
                                MessageRequest.renderFigmaComponentFromContentfulComponent,
                                {
                                    entry,
                                    cDefRootUrl
                                }
                            );
                            setIsLoading(false);
                            setCacheBust(Date.now());
                        }} />
                </div>
            )}
            
            <Flex
                flexDirection="row"
                gap="spacingXs"
                justifyContent="flex-start">
                {entryId ? (<>
                    <CUIToolbarLabel value="Entry ID:"></CUIToolbarLabel>
                    <CUIToolbarLabel value={entryId || ''} style={{flex: '1'}}></CUIToolbarLabel>
                    <ToggleButton icon={<ExternalLinkIcon />}
                        size="small"
                        aria-label="Contentful Entry"
                        onToggle={() => {
                            window.open(`https://app.contentful.com/spaces/${
                                    spaceId
                                }/environments/${
                                    environmentId
                                }/entries/${
                                    entryId
                                }`, '_blank');
                        }}
                        />
                    <ToggleButton icon={
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="16" height="16">
                            <path d="M94 187.1C120.8 124.1 183.3 80 256 80c39.7 0 77.8 15.8 105.9 43.9L414.1 176 360 176c-13.3 0-24 10.7-24 24s10.7 24 24 24l112 0c13.3 0 24-10.7 24-24l0-112c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 54.1L395.9 89.9C358.8 52.8 308.5 32 256 32C163.4 32 83.9 88.2 49.8 168.3c-5.2 12.2 .5 26.3 12.7 31.5s26.3-.5 31.5-12.7zm368 157c5.2-12.2-.4-26.3-12.6-31.5s-26.3 .4-31.5 12.6C391 388.1 328.6 432 256 432c-39.7 0-77.8-15.8-105.9-43.9L97.9 336l54.1 0c13.3 0 24-10.7 24-24s-10.7-24-24-24L40 288c-13.3 0-24 10.7-24 24l0 112c0 13.3 10.7 24 24 24s24-10.7 24-24l0-54.1 52.1 52.1C153.2 459.2 203.5 480 256 480c92.5 0 171.8-56 206-135.9z"/>
                        </svg>}
                      size="small"
                      aria-label="Refresh"
                      onToggle={() => setCacheBust(Date.now())}
                      />
                    <CUIToolbarButton
                        label="Pull"
                        onClick={async () => {
                            if (
                                !ctflCPAKey ||
                                !ctflCMAKey ||
                                !spaceId ||
                                !environmentId
                            ) {
                                return;
                            }
                            const entryId = cdefInstance?.$identifier?.contentful;
                            if (!entryId) return;
                            setIsLoading(true);
                            const client = contentful.createClient({
                                space: spaceId,
                                environment: environmentId,
                                accessToken: ctflCPAKey,
                                host: 'preview.contentful.com'
                            });
                            const entry = await client.getEntry(entryId, {
                                include: 10
                            });
                            await postMessagePromise(
                                MessageRequest.renderFigmaComponentFromContentfulComponent,
                                {
                                    entry,
                                    cDefRootUrl
                                }
                            ); 
                            setIsLoading(false);
                        }} />
                    <CUIToolbarButton
                        label="Push"
                        onClick={async () => {
                            if (!ctflCMAKey || !spaceId || !environmentId || !cdefInstance || !cDefRootUrl) return;
                            setIsLoading(true);
                            await updateEntries(
                                cdefInstance,
                                ctflCMAKey,
                                spaceId,
                                environmentId,
                                cDefRootUrl
                            );
                            setIsLoading(false);
                            setCacheBust(Date.now());
                        }} />
                </>) : (null)}
                
            </Flex>
        </Flex>
    );
}

export default CodeContentfulPage;
