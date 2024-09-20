import React, { useState } from "react";
import { Flex } from '@contentful/f36-components';
import './CodeContentfulPage.scss';
import CUIToolbarButton from "../../ctfl-ui-editor/toolbar-button/ToolbarButton.js";
import * as contentful from 'contentful-management';
import {
    CDefInstance,
    getComponentDefinition
} from "@contentful-demos/component-definitions/dist/index.js";
import CUIToolbarLabel from "../../ctfl-ui-editor/toolbar-label/ToolbarLabel.js";
import updateEntries from "./utils/updateEntries.js";

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

    const entryId = cdefInstance?.$identifier ? cdefInstance.$identifier['contentful'] : '';

    return (
        <Flex 
            className="code-page"
            flexDirection="column"
            padding="spacingM"
            gap="spacingS">
            <iframe src={`http://localhost:1234/preview?entry_id=${
                    entryId
                }&contentful_space_id=${
                    spaceId
                }&contentful_environment_id=${
                    environmentId
                }&contentful_access_token=${
                    ctflCPAKey
                }&${cacheBust}`} />
            <Flex
                flexDirection="row"
                gap="spacingXs"
                justifyContent="flex-start">
                <CUIToolbarLabel value="Entry ID:"></CUIToolbarLabel>
                <CUIToolbarLabel value={entryId || ''} style={{flex: '1'}}></CUIToolbarLabel>
                <CUIToolbarButton
                    label="Pull"
                    onClick={async () => {
                        
                    }} />
                <CUIToolbarButton
                    label="Push"
                    onClick={async () => {
                        if (!ctflCMAKey || !spaceId || !environmentId || !cdefInstance || !cDefRootUrl) return;
                        await updateEntries(
                            cdefInstance,
                            ctflCMAKey,
                            spaceId,
                            environmentId,
                            cDefRootUrl
                        );

                        setCacheBust(Date.now());
                    }} />
            </Flex>
        </Flex>
    );
}

export default CodeContentfulPage;
