import htmlCssExpertSystem from './systems/htmlCssExpertSystem.mjs';
import processImageToHTMLSystem from './systems/processImageToHTMLSystem.mjs';
import textSystem from './systems/textSystem.mjs';
import webCompInstanceSystem from './systems/webCompInstanceSystem.mjs';
import webCompSystem from './systems/webCompSystem.mjs';


const systemsIndex = [
    {
        group: "Text",
    },
    textSystem,
    {
        group: "Web Components",
    },
    webCompSystem,
    webCompInstanceSystem,
    {
        group: "HTML/CSS",
    },
    htmlCssExpertSystem,
    {
        group: "Image Processing",
    },
    processImageToHTMLSystem,
];

export default systemsIndex;