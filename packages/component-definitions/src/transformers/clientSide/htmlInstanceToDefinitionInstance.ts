
import {
    CDefInstance,
} from "../../types";
import getComponentDefinition from "../utils/getComponentDefinition";
// import getComponentDefinitionTokenLookup from "../utils/getComponentDefinitionTokenLookup";

export default async function htmlInstanceToDefinitionInstance(
    html: string | undefined,
    cDefPath: string,
): Promise<CDefInstance | undefined> {
    if (!html) return;

    // const tokenLookup = await getComponentDefinitionTokenLookup(cDefPath);

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    if (!doc || !doc.body.children[0]) {
        console.log('did no find any children', doc)
        return;
    }

    const htmlElement = doc.body.children[0];
    const compName = htmlElement.nodeName.toLowerCase();
    const compDefinition = await getComponentDefinition(cDefPath, compName);
    if (!compDefinition) {
        console.error(`Component Definition not found`, cDefPath, compName);
        return;
    }

    // process into cdef via compDef props
    const defInstance: any = {};
    defInstance['$schema'] = `${compName}.cdef.json`;
    if (compDefinition.properties) {
        Object.entries(compDefinition.properties).map(entry => {
            const name = entry[0];
            // const prop = entry[1];
            // TODO: look for slots, output, 
            if (htmlElement.getAttribute(name)) {
                defInstance[name] = htmlElement.getAttribute(name);
            }
        })
    }

    return defInstance; 
}