import imageToHTML from './prompts/images/ImageToHTML.mjs';
import imageToHTMLToTokens from './prompts/images/ImageToHTMLToTokens.mjs';
import imageToHTMLToWebComps from './prompts/images/imageToHTMLToWebComps.mjs';
import test from './prompts/tests/test.mjs';
import webComp from './prompts/webComps/webcomp.mjs';
import webcompCDef from './prompts/webComps/webcompCDef.mjs';

const actionsIndex = [
    {
        group: "Web Components",
    },
    webComp,
    webcompCDef,
    {
        group: "Image to HTML",
    },
    imageToHTML,
    imageToHTMLToTokens,
    imageToHTMLToWebComps,
    {
        group: "Testing",
    },
    test,
];

export default actionsIndex;