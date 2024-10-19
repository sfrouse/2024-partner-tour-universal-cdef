import designSystemSimpleCard from './prompts/designSystems/designSystemSimpleCard.mjs';
import imageToHTML from './prompts/images/ImageToHTML.mjs';
import imageToHTMLToRawTokens from './prompts/images/ImageToHTMLToRawTokens.mjs';
import ImageToHTMLToSemanticTokens from './prompts/images/ImageToHTMLToSemanticTokens.mjs';
import imageToHTMLToTokens from './prompts/images/ImageToHTMLToTokens.mjs';
import imageToHTMLToWebComps from './prompts/images/ImageToHTMLToWebComps.mjs';
import imageWebCompsToSingleComp from './prompts/images/ImageWebCompsToSingleComp.mjs';
import primitiveToSemanticAction from './prompts/macros/primitiveToSemanticAction.mjs';
import test from './prompts/tests/test.mjs';
import webComp from './prompts/webComps/webcomp.mjs';
import webcompCDef from './prompts/webComps/webcompCDef.mjs';

const actionsIndex = [
    {group: "Demo App Intro"},
        test,
    {group: "Design Sandbox"},
        webComp,
    {group: "AI Ready DSys - Tokens"},
        imageToHTML,
        imageToHTMLToRawTokens,
        imageToHTMLToTokens,
        ImageToHTMLToSemanticTokens,
    {group: "AI Ready DSys - CDefs"},
        webcompCDef,
        imageToHTMLToWebComps,
        imageWebCompsToSingleComp,
    {group: "Macros"},
        primitiveToSemanticAction,
        designSystemSimpleCard,

];

export default actionsIndex;