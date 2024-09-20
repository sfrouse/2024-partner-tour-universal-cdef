
import { CDefDesignProperty } from '../../../decorators/defineComponent.js';
import {
    CDefDefinition,
    CDefInstance,
    CDefTokenLookup
} from '../../../types.js';
import { findFigmaPropViaTokenLookup } from '../../../utils/findViaTokenLookup.js';
import definitionInstanceToFigmaInstance from '../../definitionInstanceToFigmaInstance.js';
import { findPropertyObjectVariable } from '../applyStyleProperties.js';
import {
    // applyLayoutModeAndFixedSizes,
    // applyPaddingAndAlignment,
    // applyResizing
} from './applyLayout.js';
import {
    applyLocalLayout,
    captureLocalLayout
} from './localLayout.js';

export default async function processSlot(
    compDefinition: CDefDefinition,
    slotPropertyName: string,
    instanceSlots: {[key:string]: InstanceNode},
    componentSlots: {[key:string]: InstanceNode},
    cDefRootUrl: string,
    slotDef: CDefDefinition,
    defInstance: CDefInstance,
    isComponentClone: boolean,
    tokenLookup: CDefTokenLookup | undefined,
    allVarsLookup: {[name:string]: {}[]},
) {
    const slotDefInstance = defInstance[slotPropertyName];

    if (slotDefInstance) {
        // change right away to avoid recursion errors
        const instanceSlot = instanceSlots[slotPropertyName];

        // Create Component that replaces in Slot
        const slotComp = figma.createComponent();
        slotComp.name = "_slot"; // keep name
        slotComp.fills = [];

        if (instanceSlot) {
            const isDefaultSlot = ( slotDef['x-cdef']?.output?.webComponent?.defaultSlot === true );
            const prevLayout = captureLocalLayout(instanceSlot);
            slotComp.layoutMode = prevLayout.layoutMode;
            if (isDefaultSlot) {
                if (isComponentClone) {
                    // we can change the height/width of instances within comps
                    // const componentSlot = componentSlots[slotPropertyName];
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

                const gap = defInstance[CDefDesignProperty.GAP];
                const figmaGapProp = findFigmaPropViaTokenLookup(`${gap}`, tokenLookup);
                const figmaGapPropVar = await findPropertyObjectVariable(figmaGapProp, allVarsLookup, figma);
                if (figmaGapPropVar) {
                    instanceSlot.setBoundVariable(
                        'itemSpacing',
                        figmaGapPropVar
                    );
                }

                // applyPaddingAndAlignment(
                //     defInstance,
                //     compDefinition,
                //     instanceSlot        // Instance
                // );
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

        if (Array.isArray(slotDefInstance)) {
            // Entries from slot entry value...
            for (const childDefInstance of slotDefInstance) {
                await definitionInstanceToFigmaInstance(
                    childDefInstance,
                    cDefRootUrl,
                    slotComp,
                    figma,
                    (figmaInstance) => {
                        // Instances w/o internal resizing should mimic the slot resizing
                        if (!isComponentClone) {
                            figmaInstance.layoutSizingHorizontal = instanceSlot.layoutSizingHorizontal;
                            figmaInstance.layoutSizingVertical = instanceSlot.layoutSizingVertical;
                        }
                    },
                    false
                );
            }
        }else if (typeof slotDefInstance === 'object') {
            await definitionInstanceToFigmaInstance(
                slotDefInstance as CDefInstance,
                cDefRootUrl,
                slotComp,
                figma,
                (figmaInstance) => {
                    // Instances w/o internal resizing should mimic the slot resizing
                    if (!isComponentClone) {
                        figmaInstance.layoutSizingHorizontal = instanceSlot.layoutSizingHorizontal;
                        figmaInstance.layoutSizingVertical = instanceSlot.layoutSizingVertical;
                    }
                },
                false
            );
        }

        // slotComp.visible = false;
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

        emptyComp.visible = false;
        emptyComp.remove();
    }
}
