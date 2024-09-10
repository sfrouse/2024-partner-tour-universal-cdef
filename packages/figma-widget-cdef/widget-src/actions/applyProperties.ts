import { CDefInstance } from "@contentful-demos/component-definitions";
import { findExposedChildren } from "@contentful-demos/component-definitions/dist/index.js";

export function applyProperties(
    figmaInstance: InstanceNode,
    defInstance: CDefInstance,
    compPropDefs: any
) {
    // CREATE NEW COMP PROPERTIES
    const newProps: {[key:string]: string} = {};
    Object.keys(figmaInstance.componentProperties).map(name => {
        processComponentProperty(
            name,
            defInstance,
            compPropDefs,
            newProps
        );
    });
    console.log('figmaInstance.componentProperties', figmaInstance.componentProperties);
    console.log('defInstance', defInstance);

    const exposedChildren = findExposedChildren(figmaInstance);
    exposedChildren.map((child: { componentProperties: {}; setProperties: (arg0: { [key: string]: string; }) => void; }) => {
        const newChildProps: {[key:string]: string} = {};
        Object.keys(child.componentProperties).map(name => {
            processComponentProperty(
                name,
                defInstance,
                compPropDefs,
                newChildProps
            );
        });
        child.setProperties(newChildProps);
    });

    if (defInstance.$identifier) {
        figmaInstance.setPluginData(
            'contentfulIdentifier',
            (defInstance.$identifier as any).contentful
        );
    }
    figmaInstance.setProperties(newProps);
}

function processComponentProperty(
    name: string,
    defInstance: CDefInstance,
    compPropDefs: any,
    newProps: {[key:string]: string}
) {
    let finalNameArr = name.split('#');
    finalNameArr.length > 1 ? finalNameArr.pop() : null;
    const finalName = finalNameArr.join('');
    const defInstanceValue = defInstance[finalName];
    if (defInstanceValue !== undefined) {
        const compProp = compPropDefs[finalName];
        const value = `${defInstanceValue}`;
        if (compProp && compProp.type === 'VARIANT') {
            if (
                compProp.variantOptions &&
                compProp.type === 'VARIANT' &&
                compProp.variantOptions.includes(value)
            ) {
                newProps[name] = `${defInstanceValue}`;
            }else{
                console.error(`Variation not found in Figma component ${finalName}`);
                // figma.notify(`Variation not found in Figma component ${finalName}`, {error: true})
            }
        }else{
            newProps[name] = `${defInstanceValue}`;
        }
    }else{
        console.error(`Did not find defInstance for "${finalName}"`)
    }
}