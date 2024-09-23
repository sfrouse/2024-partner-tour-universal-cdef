import designSystemSimpleCard from './prompts/designSystems/designSystemSimpleCard.mjs';
import imageToHTML from './prompts/images/ImageToHTML.mjs';
import imageToHTMLToRawTokens from './prompts/images/ImageToHTMLToRawTokens.mjs';
import ImageToHTMLToSemanticTokens from './prompts/images/ImageToHTMLToSemanticTokens.mjs';
import imageToHTMLToTokens from './prompts/images/ImageToHTMLToTokens.mjs';
import imageToHTMLToWebComps from './prompts/images/ImageToHTMLToWebComps.mjs';
import imageWebCompsToSingleComp from './prompts/images/ImageWebCompsToSingleComp.mjs';
import test from './prompts/tests/test.mjs';
import webComp from './prompts/webComps/webcomp.mjs';
import webcompCDef from './prompts/webComps/webcompCDef.mjs';

const actionsIndex = [
    {
        group: "Text",
    },
    test,
    {
        group: "Image to HTML",
    },
    imageToHTML,
    imageToHTMLToRawTokens,
    imageToHTMLToTokens,
    ImageToHTMLToSemanticTokens,
    imageToHTMLToWebComps,
    imageWebCompsToSingleComp,
    {
        group: "Web Components",
    },
    webComp,
    webcompCDef,
    {
        group: "Design System",
    },
    designSystemSimpleCard
];

export default actionsIndex;