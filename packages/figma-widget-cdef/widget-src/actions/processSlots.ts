import { CDefDefinition, CDefInstance } from "@contentful-demos/component-definitions";
import * as contentful from 'contentful';
import runPromisesInSequence from "../utils/runPromisesInSequence.js";
import processSlot from "./processSlots/processSlot.js";
import { findFigmaSlots } from "@contentful-demos/component-definitions/dist/index.js";
import findDefinitionSlots from "./processSlots/findDefinitionSlots.js";

export async function processSlots(
    compDefinition: CDefDefinition,
    figmaComponent: ComponentNode | undefined,
    figmaInstance: InstanceNode,
    entry: contentful.Entry,
    cDefRootUrl: string,
    defInstance: CDefInstance,
    isClone: boolean
) {
    if (!figmaComponent) return;

    if (compDefinition.properties) {
        // find what slots to expect
        const slotDefs = findDefinitionSlots(compDefinition);

        // map to figma slots...
        // this requires a specific instance (named after the property) of a 
        // component named "slots" with child instances of "slots-child"
        const instanceSlots = findFigmaSlots(figmaInstance);

        const componentSlots = findFigmaSlots(figmaComponent);

        const promiseArr: (() => Promise<void>)[] = [];
        Object.entries(slotDefs).map((slotEntry) => {
            const slotName = slotEntry[0];
            const slotDef = slotEntry[1];
            promiseArr.push((async () => processSlot(
                compDefinition,
                slotName,
                entry,
                instanceSlots,
                componentSlots,
                cDefRootUrl,
                slotDef,
                defInstance,
                isClone,
            )));
        });
        await runPromisesInSequence(promiseArr);
    }
}




