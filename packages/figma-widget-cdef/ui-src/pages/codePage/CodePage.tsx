import React from "react";
import { Flex } from '@contentful/f36-components';
import { CDefManifest } from "@contentful-demos/component-definitions/dist";
import './CodePage.scss';

const CodePage = (
    args: {
        exampleCode: string
    }
) => {
  
    const {
        exampleCode
    } = args;

    return (
        <Flex 
            className="code-page"
            flexDirection="column" padding="spacingM">
            <pre
              style={{
                overflow: 'auto', fontSize: 12, tabSize: 2
              }}>
              {exampleCode || ''}
            </pre>
        </Flex>
    );
}

export default CodePage;
