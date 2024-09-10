import React from "react";
import { Flex } from '@contentful/f36-components';
import { CDefManifest } from "@contentful-demos/component-definitions/dist/index.js";
import './HtmlPage.scss';

const HtmlPage = (
    args: {
        exampleCode: string,
        cDefRootUrl: string,
        manifest: CDefManifest | undefined
    }
) => {
  
    const {
        exampleCode,
        cDefRootUrl,
        manifest
    } = args;
  
    if (!manifest || !cDefRootUrl) {
        return (
            <div>nope</div>
        );
    }

    return (
        <Flex 
            className="html-page"
            flexDirection="column" padding="spacingM">
            <iframe
                srcDoc={`
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Widget HTML</title>
    <script type="module" src="${cDefRootUrl}/${manifest.componentJavascript}"></script>
    <link rel="stylesheet" href="${`${cDefRootUrl}/${manifest.componentCSS}`}">
    <style>
        html, body {
            margin: 0;
            padding: 0;
        }
        body {
            /*display: flex;
            align-items: center;
            justify-content: center;*/
            padding: 20px;
        }
    </style>
  </head>
  <body>
    ${exampleCode || ''}
  </body>
</html>
                `}></iframe>
        </Flex>
    );
}

export default HtmlPage;
