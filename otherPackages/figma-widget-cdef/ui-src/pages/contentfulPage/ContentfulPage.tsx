import React, {useEffect, useState} from "react";
import { Flex, Spinner, ToggleButton } from '@contentful/f36-components';
import { ExternalLinkIcon } from '@contentful/f36-icons';
import { CDefManifest } from "@contentful-demos/component-definitions/dist/index.js";
import * as contentful from 'contentful';
import * as cma from 'contentful-management';
import './ContentfulPage.scss';
import CUIToolbarButton from "../../ctfl-ui-editor/toolbar-button/ToolbarButton.js";
import CUIToolbarSelect from "../../ctfl-ui-editor/toolbar-select/ToolbarSelect.js";
import postMessagePromise from "../../utils/postMessagePromise.js";
import { MessageRequest } from "../../../shared-src/types.js";

const ContentfulPage = (
    args: {
        cDefRootUrl: string,
        ctflCMAKey: string | undefined,
        ctflCPAKey: string | undefined,
        manifest: CDefManifest | undefined,
        organizationId: string | undefined,
        spaceId: string | undefined,
        environmentId: string | undefined,
        contentTypes: cma.ContentType[] | undefined | void
    }
) => {
  
    const {
        cDefRootUrl,
        manifest,
        ctflCMAKey,
        ctflCPAKey,
        organizationId,
        spaceId,
        environmentId,
        contentTypes,
    } = args;


    const [entries, setEntries] = useState<contentful.Entry[]>([]);
    const [contentTypeId, setContentTypeId] = useState<string>('dmo-container');
    const [loading, setLoading] = useState<boolean>(false);
  
    useEffect(() => {
        if (
            ctflCPAKey &&
            spaceId &&
            environmentId &&
            contentTypeId
        ) {
            (async() => {
                setLoading(true);
                setEntries([]);
                const client = contentful.createClient({
                    space: spaceId,
                    environment: environmentId,
                    accessToken: ctflCPAKey,
                    host: 'preview.contentful.com'
                });
                const entries = await client.getEntries({
                    content_type: contentTypeId,
                    limit: 1000,
                    include: 10
                });
                if (entries && entries.total > 0) {
                    setEntries(entries.items);
                }else{
                    setEntries([]);
                }
                setLoading(false);
            })();
        }
    }, [ctflCPAKey, spaceId, environmentId, contentTypeId]);

    if (
        !ctflCPAKey ||
        !ctflCMAKey ||
        !organizationId ||
        !spaceId ||
        !environmentId
    ) {
        return (
            <div>Need access to Contentful and a selected environment to work</div>
        );
    }

    if (!manifest || !cDefRootUrl) {
        return (
            <div>Need a manifest to work</div>
        );
    }

    let contentTypeOptions: {[key:string]: string} = {"Choose Content Type": ''};
    contentTypes?.map(type => {
        contentTypeOptions[type.name] = type.sys.id; 
    });

    return (
        <Flex 
            className="contentful-page" gap="spacingS"
            flexDirection="column"
            paddingLeft="spacingM"
            paddingRight="spacingM"
            paddingTop="spacingS">
            <CUIToolbarSelect
                value={contentTypeId}
                options={contentTypeOptions}
                onChange={setContentTypeId} />
            {loading ? (
                <Spinner />
            ) : ''}
            <div className="entries">
                <div className="body scroll-bar">
                {entries.map(entry => {
                    const key = Object.keys(entry.fields).find(key => key === 'title' || key === 'label' || key === 'internalLabel');
                    return (
                        <div
                            className="entry" 
                            key={entry.sys.id}>
                            <div className="title">
                                {key ? (<>{entry.fields[key]} <span>{entry.sys.id}</span></>) : entry.sys.id}
                            </div>
                            <ToggleButton icon={<ExternalLinkIcon />}
                                size="small"
                                aria-label="Contentful Entry"
                                onToggle={() => {
                                    window.open(`https://app.contentful.com/spaces/${
                                            spaceId
                                        }/environments/${
                                            environmentId
                                        }/entries/${
                                            entry.sys.id
                                        }`, '_blank');
                                }}
                                />
                            {entry.fields['componentInstance'] ? (
                                <CUIToolbarButton
                                    label="Create"
                                    onClick={async () => {
                                        postMessagePromise(MessageRequest.renderFigmaComponentFromContentfulComponent, {
                                            entry,
                                            cDefRootUrl
                                        });
                                    }} />
                                ) : ''}
                            
                        </div>
                    );
                })}
                </div>
            </div>
        </Flex>
    );
}

export default ContentfulPage;
