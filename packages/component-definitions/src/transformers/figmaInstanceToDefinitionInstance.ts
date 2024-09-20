import findExposedChildren from "../utils/findExposedChildren";
import { CDefDefinition, CDefInstance } from "../types";
import findInstanceOfProp from "./utils/findInstanceOfProp";
import getComponentDefinition from "./utils/getComponentDefinition";
// import { findLayoutPropertyName, getLayoutFromStorage } from "../utils/layoutStorage";
import { getAllVariablesLookupViaId } from "./figmaUtils/applyStyleProperties";
import { getComponentDefinitionTokenLookupIndexedToFigmaVariables } from "./utils/getComponentDefinitionTokenLookup";
import { CDefDesignProperty } from "../decorators/defineComponent";
import findSlotChildren from "./utils/findSlotChildren";
// Having trouble getting Figma types to work here...

export default async function figmaInstanceToDefinitionInstance(
    node: any | undefined,
    cDefPath: string,
    figma: any, // Figma API,
    allVarsLookupCached?: {[name: string]: {}[]},
    tokenLookupCached? : any
): Promise<CDefInstance | undefined> {

    const allVarsLookup = allVarsLookupCached || await getAllVariablesLookupViaId(figma);
    const tokenLookup = tokenLookupCached || await getComponentDefinitionTokenLookupIndexedToFigmaVariables(cDefPath);

    // TODO: figure out auto-layout nodes
    if (node.type === "INSTANCE") {
        const figmaInstance: any = {};
        const compName = getInstanceCompName(node);
        figmaInstance['$schema'] = `${compName}.cdef.json`;
        const compDefinition = await getComponentDefinition(
            cDefPath,
            figmaInstance['$schema'] as string
        );
        if (!compDefinition) {
            console.error(
                `Component Definition not found`,
                cDefPath,
                figmaInstance['$schema']
            );
            return;
        }

        // Identifier transfer
        const contentfulId = node.getPluginData('contentfulIdentifier');
        figmaInstance['$identifier'] = {contentful: contentfulId};

        // Node Component Properties
        const promiseArr: Promise<any>[] = [];
        Object.entries(node.componentProperties).map(entry => {
            promiseArr.push((async() => {
                const propName = entry[0];
                const prop = entry[1] as any;
                return processProp(
                    propName,
                    prop,
                    compDefinition,
                    node,
                    figmaInstance,
                    cDefPath,
                    figma
                );
            })());
        });

        // Exposed Children
        const exposedChildren = findExposedChildren(node);
        exposedChildren.map(child => {
            Object.entries(child.componentProperties).map(entry => {
                promiseArr.push((async() => {
                    const propName = entry[0];
                    const prop = entry[1] as any;
                    return processProp(
                        propName,
                        prop,
                        compDefinition,
                        child,
                        figmaInstance,
                        cDefPath,
                        figma
                    );
                })());
            });
        });

        // Design Properties
        if (compDefinition.properties) {
            Object.entries(compDefinition.properties).map((entry: any) => {
                const propName = entry[0];
                const prop = entry[1];
                if (prop['x-cdef']?.design === true) {
                    switch (propName) {
                        case CDefDesignProperty.BACKGROUND_COLOR: {
                            if ( node.backgrounds?.length > 0) {
                                const background = node.backgrounds[0];
                                if (background.boundVariables?.color) {
                                    const variable = allVarsLookup[background.boundVariables.color.id] as any;
                                    const variableGlobalId = tokenLookup[`variable:${variable[0].name}`];
                                    figmaInstance[propName] = variableGlobalId;
                                }
                            }
                            break;
                        }
                        case CDefDesignProperty.TEXT_COLOR: {
                            const textNode = findFirstTextChild(node);
                            if (textNode) {
                                if ( textNode.boundVariables.fills?.length > 0) {
                                    const fill = textNode.boundVariables.fills[0];
                                    const variable = allVarsLookup[fill.id] as any;
                                    const variableGlobalId = tokenLookup[`variable:${variable[0].name}`];
                                    figmaInstance[propName] = variableGlobalId;
                                }
                            }
                            break;
                        }
                        case CDefDesignProperty.PADDING: {
                            // only one to one padding value right now...
                            if ( node.boundVariables?.paddingTop ) {
                                const variable = allVarsLookup[node.boundVariables.paddingTop.id] as any;
                                const variableGlobalId = tokenLookup[`variable:${variable[0].name}`];
                                figmaInstance[propName] = variableGlobalId;
                            }
                            break;
                        }
                        case CDefDesignProperty.CORNER_RADIUS: {
                            // only one right now
                            if ( node.boundVariables?.topLeftRadius ) {
                                const variable = allVarsLookup[node.boundVariables.topLeftRadius.id] as any;
                                const variableGlobalId = tokenLookup[`variable:${variable[0].name}`];
                                figmaInstance[propName] = variableGlobalId;
                            }
                            break;
                        }
                        case CDefDesignProperty.GAP: {
                            const slotChildren = findSlotChildren(node);
                            if (slotChildren) {
                                slotChildren.map(slotChild => {
                                    if (slotChild.boundVariables?.itemSpacing) {
                                        const variable = allVarsLookup[slotChild.boundVariables.itemSpacing.id] as any;
                                        const variableGlobalId = tokenLookup[`variable:${variable[0].name}`];
                                        figmaInstance[propName] = variableGlobalId;
                                    }
                                });
                            }
                            break;
                        }
                        case CDefDesignProperty.BORDER_COLOR: {
                            // only one right now
                            if ( node.boundVariables?.strokes?.length > 0) {
                                const stroke = node.boundVariables?.strokes[0];
                                const variable = allVarsLookup[stroke.id] as any;
                                const variableGlobalId = tokenLookup[`variable:${variable[0].name}`];
                                figmaInstance[propName] = variableGlobalId;
                            }
                            break;
                        }
                        case CDefDesignProperty.BORDER_WIDTH: {
                            // only one right now
                            if ( node.boundVariables?.strokeTopWeight ) {
                                const weight = node.boundVariables.strokeTopWeight;
                                const variable = allVarsLookup[weight.id] as any;
                                const variableGlobalId = tokenLookup[`variable:${variable[0].name}`];
                                figmaInstance[propName] = variableGlobalId;
                            }
                            break;
                        }
                        case CDefDesignProperty.BORDER_STYLE: {
                            // only one right now
                            if ( node.strokes?.length > 0) {
                                const stroke = node.strokes[0];
                                figmaInstance[propName] = stroke.type.toLowerCase();
                            }
                            break;
                        }
                        case CDefDesignProperty.LAYOUT_DIRECTION: {
                            const slotChildren = findSlotChildren(node);
                            if (slotChildren) {
                                slotChildren.map(slotChild => {
                                    figmaInstance[propName] =
                                        slotChild.layoutMode === "HORIZONTAL" ? "row" : "column"
                                });
                            }
                            break;
                        }
                    }
                }
            });
        }

        // Layout Information
        // const layoutPropName = findLayoutPropertyName(compDefinition);
        // if (layoutPropName) {
        //     const layout = getLayoutFromStorage(node);
        //     if (layout) {
        //         figmaInstance[layoutPropName] = layout;
        //     }
        //     // TODO: think about pulling from auto-layout...
        //     // there may NOT be enough info...
        // }

        const slotChildren = findSlotChildren(node);
        slotChildren.map(slot => {
            // slots are not anything in themselves...look through children
            const slotDefs: any[] = [];
            slot.children.map((slotChild: any) => {
                promiseArr.push((async () => {
                    const slotChildDef = await figmaInstanceToDefinitionInstance(
                        slotChild, cDefPath, figma, allVarsLookup, tokenLookup
                    );
                    slotDefs.push(slotChildDef);
                })());
            });
            figmaInstance[slot.name] = slotDefs;
        })

        await Promise.all(promiseArr);

        return figmaInstance;
    }
    return;
}

function getInstanceCompName(instance: any) {
    const comp = instance.mainComponent;
    const compParent = comp.parent;
    let name = instance.name;
    if (compParent?.type === "COMPONENT_SET") {
        name = compParent.name;
    }else{
        name = comp.name;
    }
    return name;
}

async function processProp(
    propName: string,
    prop: any,
    compDefinition: CDefDefinition,
    node: any,
    figmaInstance: any,
    cDefPath: string,
    figma: any
) {
    let propNameArr = propName.split('#');
    propNameArr.length > 1 ? propNameArr.pop() : null;
    const finalName = propNameArr.join('#');
    // we are not linting here...just take out.
    if (!compDefinition.properties || compDefinition.properties[finalName] === undefined) return;
    if (prop.type === "INSTANCE_SWAP") {
        const instances = findInstanceOfProp(node, propName);
        const cDef = compDefinition.properties[finalName];
        const swapDefInstances = await Promise.all(
            instances.map(inst => {
                return (async() => {
                    return await figmaInstanceToDefinitionInstance(inst, cDefPath, figma);
                })();
            })
        );
        if (cDef.type === 'array') {
            figmaInstance[finalName] = swapDefInstances;
        }else{
            figmaInstance[finalName] = swapDefInstances?.length > 0 ? swapDefInstances[0] : [];
        }
    }else{
        figmaInstance[finalName] = prop.value;
    }
}

// function findSlotChildren(node: any, slotChildren: any[] = []) {
//     if (node.children) {
//         node.children.map((child: any) => {
//             if (
//                 child.type === 'INSTANCE' &&
//                 child.mainComponent?.name === '_slot'
//             ) {
//                 slotChildren.push(child);
//             }else{
//                 // not entirely recursive...
//                 // the slot will be process on it's own
//                 findSlotChildren(child, slotChildren);
//             }
//         })
//     }
//     return slotChildren;
// }

function findFirstTextChild(node: any) {
    console.log('node.type', node.type);
    let targetNode = node;
    if (targetNode.type !== 'TEXT') {
        targetNode = node.children.find((child: any) => child.type === 'TEXT');
    }
    return targetNode;
}