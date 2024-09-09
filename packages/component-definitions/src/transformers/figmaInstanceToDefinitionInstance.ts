import findExposedChildren from "../utils/findExposedChildren";
import { CDefDefinition, CDefInstance } from "../types";
import findInstanceOfProp from "./utils/findInstanceOfProp";
import getComponentDefinition from "./utils/getComponentDefinition";
import { findLayoutPropertyName, getLayoutFromStorage } from "../utils/layoutStorage";
// Having trouble getting Figma types to work here...

export default async function figmaInstanceToDefinitionInstance(
    node: any | undefined,
    cDefPath: string,
    figma: any // Figma API
): Promise<CDefInstance | undefined> {
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

        // put together a robust figma instance...
        const promiseArr: Promise<any>[] = [];
        // Root Comp Props First
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
        })

        // Exposed Children Next
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
        
        const layoutPropName = findLayoutPropertyName(compDefinition);
        if (layoutPropName) {
            const layout = getLayoutFromStorage(node);
            if (layout) {
                figmaInstance[layoutPropName] = layout;
            }
            // TODO: think about pulling from auto-layout...
            // there may NOT be enough info...
        }

        const slotChildren = findSlotChildren(node);
        slotChildren.map(slot => {
            // slots are not anything in themselves...look through children
            const slotDefs: any[] = [];
            slot.children.map((slotChild: any) => {
                promiseArr.push((async () => {
                    const slotChildDef = await figmaInstanceToDefinitionInstance(
                        slotChild, cDefPath, figma
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

function findSlotChildren(node: any, slotChildren: any[] = []) {
    if (node.children) {
        node.children.map((child: any) => {
            if (
                child.type === 'INSTANCE' &&
                child.mainComponent?.name === '_slot'
            ) {
                slotChildren.push(child);
            }else{
                // not entirely recursive...
                // the slot will be process on it's own
                findSlotChildren(child, slotChildren);
            }
        })
    }
    return slotChildren;
}