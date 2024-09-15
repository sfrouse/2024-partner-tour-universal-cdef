import React, { useEffect, useState } from "react";
import { Flex } from '@contentful/f36-components';
import {
    htmlInstanceToDefinitionInstance
} from "@contentful-demos/component-definitions/dist/index.js";
import './ImportPage.scss';
import WebSocketManager from "../../utils/WebSocketManager.js";
import CUIToolbarButton from "../../ctfl-ui-editor/toolbar-button/ToolbarButton.js";
// import postMessagePromise from "../../utils/postMessagePromise.js";
// import { MessageRequest } from "../../../shared-src/types.js";

const ImportPage = (
    args: {
        cDefRootUrl: string,
        importCode: string,
        setImportCode: React.Dispatch<React.SetStateAction<string>>,
        webSocket: WebSocketManager | null
    }
) => {
  
    const {
        cDefRootUrl,
        importCode,
        setImportCode,
        webSocket
    } = args;

    useEffect(() => {
        const handleWebSocketMessage = (event: MessageEvent) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'import') {
                    setImportCode(data.code);
                }
            }catch(err){ console.error(err) }
        };
        webSocket?.addListener(handleWebSocketMessage);
        return () => {
            webSocket?.removeListener(handleWebSocketMessage);
        };
    }, []);

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
            <CUIToolbarButton
                label="Create"
                onClick={async () => {
                    const defInstance = await htmlInstanceToDefinitionInstance(
                        importCode, cDefRootUrl
                    );
                    console.log('importCode', importCode);
                    console.log('cDefRootUrl', cDefRootUrl);
                    console.log('defInstance', defInstance);
                }} />
        </Flex>
    );
}

export default ImportPage;
