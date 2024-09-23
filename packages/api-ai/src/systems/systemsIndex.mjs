import createLitElementWithDSysComps from './systems/designSystem/createLitElementWithDSysComps.mjs';
import designSystemComponentsSystem from './systems/designSystem/designSystemComponentsSystem.mjs';
import htmlCssExpertSystem from './systems/htmlCssExpertSystem.mjs';
import processImageToHTMLSystem from './systems/processImageToHTMLSystem.mjs';
import textSystem from './systems/textSystem.mjs';
import webCompInstanceSystem from './systems/webComps/webCompInstanceSystem.mjs';
import webCompSystem from './systems/webComps/webCompSystem.mjs';

async function getSystem(system) {
    return {
        ...system,
        prompt: await system.prompt()
    }
}

const systemsIndex = [
    {
        group: "Text",
    },
    await getSystem(textSystem),
    {
        group: "Web Components",
    },
    await getSystem(webCompSystem),
    await getSystem(webCompInstanceSystem),
    {
        group: "HTML/CSS",
    },
    await getSystem(htmlCssExpertSystem),
    {
        group: "Image Processing",
    },
    await getSystem(processImageToHTMLSystem),
    {
        group: "Design System",
    },
    await getSystem(designSystemComponentsSystem),
    await getSystem(createLitElementWithDSysComps)
];

export default systemsIndex;