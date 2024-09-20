import React from "react";
import { Flex } from '@contentful/f36-components';
import {
    htmlInstanceToDefinitionInstance
} from "@contentful-demos/component-definitions/dist/index.js";
import './ImportPage.scss';
import CUIToolbarButton from "../../ctfl-ui-editor/toolbar-button/ToolbarButton.js";
import postMessagePromise from "../../utils/postMessagePromise.js";
import { MessageRequest } from "../../../shared-src/types.js";

const ImportPage = (
    args: {
        cDefRootUrl: string,
        importCode: string,
        setImportCode: React.Dispatch<React.SetStateAction<string>>
    }
) => {
  
    const {
        cDefRootUrl,
        importCode,
        setImportCode
    } = args;

    return (
        <Flex 
            className="code-page"
            flexDirection="column"
            padding="spacingM"
            gap="spacingS">
            <textarea
                value={importCode}
                className='scroll-bar'
                onChange={(e) => setImportCode(e.target.value)}
                placeholder="paste code here..."
                spellCheck={false}
            />
            <Flex
                flexDirection="row"
                gap="spacingXs"
                justifyContent="flex-end">
                <CUIToolbarButton
                    label="Clear"
                    onClick={async () => {
                        postMessagePromise(
                            MessageRequest.clearStage
                        );
                    }} />
                <CUIToolbarButton
                    label="Create"
                    onClick={async () => {
                        // has to happen client side, in a browser
                        const defInstance = await htmlInstanceToDefinitionInstance(
                            importCode, cDefRootUrl
                        );
                        postMessagePromise(
                            MessageRequest.renderFigmaComponentFromCDef,
                            {
                                defInstance,
                                cDefRootUrl
                            }
                        );
                    }} />
            </Flex>
        </Flex>
    );
}

export default ImportPage;
