
import * as contentful from 'contentful';
import runPromisesInSequence from '../../utils/runPromisesInSequence.js';
import {
    CDefDefinition,
    CDefInstance,
} from '@contentful-demos/component-definitions';
import {
    applyLayoutModeAndFixedSizes,
    applyPaddingAndAlignment,
    applyResizing
} from './applyLayout.js';
import {
    applyLocalLayout,
    captureLocalLayout
} from './localLayout.js';
import createFigmaInstanceFromContentfulEntry from '../createFigmaInstance/createFigmaInstanceFromContentfulEntry.js';

export default async function processSlot(
    compDefinition: CDefDefinition,
    slotPropertyName: string,
    entry: contentful.Entry,
    instanceSlots: {[key:string]: InstanceNode},
    componentSlots: {[key:string]: InstanceNode},
    cDefRootUrl: string,
    slotDef: CDefDefinition,
    defInstance: CDefInstance,
    isComponentClone: boolean,
) {
    const entryValue = entry?.fields[slotPropertyName];

    if (entryValue) {
        const promiseArr: (() => Promise<InstanceNode | undefined>)[] = [];

        // change right away to avoid recursion errors
        const instanceSlot = instanceSlots[slotPropertyName];

        // Create Component that replaces in Slot
        const slotComp = figma.createComponent();
        slotComp.name = "_slot";// keep name
        slotComp.fills = [];

        if (instanceSlot) {
            const isDefaultSlot = ( slotDef['x-cdef']?.output?.webComponent?.defaultSlot === true );
            const prevLayout = captureLocalLayout(instanceSlot);
            slotComp.layoutMode = prevLayout.layoutMode;
            if (isDefaultSlot) {
                if (isComponentClone) {
                    // we can change the height/width of instances within comps
                    const componentSlot = componentSlots[slotPropertyName];
                    // applyLayoutModeAndFixedSizes(
                    //     defInstance,
                    //     compDefinition,
                    //     componentSlot   // Component Slot Instance
                    // );
                }
                // applyLayoutModeAndFixedSizes(
                //     defInstance,
                //     compDefinition,
                //     slotComp            // Slot Component
                // );
                instanceSlot.swapComponent(slotComp);
                applyPaddingAndAlignment(
                    defInstance,
                    compDefinition,
                    instanceSlot        // Instance
                );
                // applyResizing(
                //     defInstance,
                //     compDefinition,
                //     instanceSlot        // Instance
                // );
            }else{
                instanceSlot.swapComponent(slotComp);
                applyLocalLayout(instanceSlot, prevLayout);
            }
        }

        if (Array.isArray(entryValue)) {
            // Entries from slot entry value...
            entryValue.map((childEntry: any) => {
                promiseArr.push(
                    (async () => createFigmaInstanceFromContentfulEntry(
                        childEntry,
                        cDefRootUrl,
                        slotComp,
                        (figmaInstance) => {
                            // Instances w/o internal resizing should mimic the slot resizing
                            if (!isComponentClone) {
                                figmaInstance.layoutSizingHorizontal = instanceSlot.layoutSizingHorizontal;
                                figmaInstance.layoutSizingVertical = instanceSlot.layoutSizingVertical;
                            }
                        },
                        false
                    ))
                );
            });
        }else if (typeof entryValue === 'object') {
            promiseArr.push(
                (async () => createFigmaInstanceFromContentfulEntry(
                    entryValue as contentful.Entry,
                    cDefRootUrl,
                    slotComp,
                    (figmaInstance) => {
                        // Instances w/o internal resizing should mimic the slot resizing
                        if (!isComponentClone) {
                            figmaInstance.layoutSizingHorizontal = instanceSlot.layoutSizingHorizontal;
                            figmaInstance.layoutSizingVertical = instanceSlot.layoutSizingVertical;
                        }
                    },
                    false
                ))
            );
        }

        await runPromisesInSequence(promiseArr);
        slotComp.remove();
    }else{
        // Unused Slots to Empty
        const emptyComp = figma.createComponent();
        emptyComp.name = '_slot';// keep
        emptyComp.fills = [];
        emptyComp.layoutMode = 'HORIZONTAL';
        const instanceSlot = instanceSlots[slotPropertyName];
        if (instanceSlot) {
            instanceSlot.swapComponent(emptyComp);
        }
        emptyComp.remove();
    }
}
