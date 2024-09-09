import { CDefDesignProperty } from "../../../decorators/defineComponent";
import { CDefDefinition, CDefInstance, CDefLayoutValue } from "../../../types";
import { findLayoutValue } from "../../../utils/layoutStorage";

/*  ======== LAYOUT MODE AND FIXED SIZES ============ */
export function applyLayoutModeAndFixedSizes(
    defInstance: CDefInstance,
    compDefinition: CDefDefinition,
    layoutComp: any // ComponentNode | InstanceNode
) {
    const layoutDirection = defInstance[CDefDesignProperty.LAYOUT_DIRECTION];
    if (layoutDirection) {
        layoutComp.layoutMode = layoutDirection === 'column' ? 'VERTICAL' : 'HORIZONTAL';
        // TODO: reverse layouts
    }
    // const layoutValue = findLayoutValue(defInstance, compDefinition);
    // if (layoutValue) {
    //     layoutComp.layoutMode = layoutValue.direction === 'vertical' ? 'VERTICAL' : 'HORIZONTAL';
    //     // TODO: deal with units and percentage/fill sizings
    //     if (layoutValue.horizontalResizing === 'fixed') {
    //         layoutComp.layoutSizingHorizontal = 'FIXED';
    //         layoutComp.resize(
    //             layoutValue.width !== undefined ? layoutValue.width : layoutComp.width,
    //             layoutComp.height
    //         );
    //     }
    //     if (layoutValue.verticalResizing === 'fixed') {
    //         layoutComp.layoutSizingVertical = 'FIXED';
    //         layoutComp.resize(
    //             layoutComp.width,
    //             layoutValue.height !== undefined ? layoutValue.height : layoutComp.height
    //         );
    //     }
    // }
}

/*  ======== RESIZING ============ */
export function applyResizing(
    defInstance: CDefInstance,
    compDefinition: CDefDefinition,
    layoutInstance: any, // ComponentNode | InstanceNode,
    // layoutValueArg?: CDefLayoutValue,
) {
    let layoutValue: CDefLayoutValue | undefined; //  = layoutValueArg; 
    if (!layoutValue) {
        layoutValue = findLayoutValue(defInstance, compDefinition);
    }

    // RESZING
    if (layoutValue) {
        // TODO: deal with units and percentage/fill sizings
        if (layoutValue.horizontalResizing === 'fill') {
            layoutInstance.layoutSizingHorizontal = 'FILL';
        }else if (layoutValue.horizontalResizing === 'fixed') {
            layoutInstance.layoutSizingHorizontal = 'FIXED';
        }else{
            layoutInstance.layoutSizingHorizontal = 'HUG';
        }

        if (layoutValue.verticalResizing === 'fill') {
            layoutInstance.layoutSizingVertical = 'FILL';
        }else if (layoutValue.verticalResizing === 'fixed') {
            layoutInstance.layoutSizingVertical = 'FIXED';
        }else{
            layoutInstance.layoutSizingVertical = 'HUG';
        }
    }
}

/*  ======== PADDING AND ALIGNMENT ============ */
// export function applyPaddingAndAlignment(
//     defInstance: CDefInstance,
//     compDefinition: CDefDefinition,
//     layoutInstance: any // InstanceNode
// ) {
//     const layoutValue = findLayoutValue(defInstance, compDefinition);
//     if (layoutValue) {
//         layoutInstance.layoutMode = layoutValue.direction === 'vertical' ? 'VERTICAL' : 'HORIZONTAL';
//         // PADDING
//         if (layoutValue.padding) {
//             layoutInstance.paddingTop = parseInt(`${layoutValue.padding[0]}`);
//             layoutInstance.paddingRight = parseInt(`${layoutValue.padding[1]}`);
//             layoutInstance.paddingBottom = parseInt(`${layoutValue.padding[2]}`);
//             layoutInstance.paddingLeft= parseInt(`${layoutValue.padding[3]}`);
//         }
//         // GAP
//         if (layoutValue.gap) {
//             layoutInstance.itemSpacing = parseInt(`${layoutValue.gap[0]}`);
//         }
//         // VERTICAL ALIGNMENT
//         if (layoutValue.verticalAlignment) {
//             if (layoutInstance.layoutMode === 'HORIZONTAL') {
//                 layoutInstance.counterAxisAlignItems = 
//                     layoutValue.verticalAlignment === 'top' ? 'MIN' :
//                     layoutValue.verticalAlignment === 'center' ? 'CENTER' : 'MAX';
//             }else{
//                 layoutInstance.primaryAxisAlignItems =
//                     layoutValue.verticalAlignment === 'top' ? 'MIN' :
//                     layoutValue.verticalAlignment === 'center' ? 'CENTER' : 'MAX';
//             }
//         }
//         // HORIZONTAL ALIGNMENT
//         if (layoutValue.horizontalAlignment) {
//             if (layoutInstance.layoutMode === 'HORIZONTAL') {
//                 layoutInstance.primaryAxisAlignItems =
//                     layoutValue.horizontalAlignment === 'left' ? 'MIN' :
//                     layoutValue.horizontalAlignment === 'center' ? 'CENTER' : 'MAX';
//             }else{
//                 layoutInstance.counterAxisAlignItems =
//                     layoutValue.horizontalAlignment === 'left' ? 'MIN' :
//                     layoutValue.horizontalAlignment === 'center' ? 'CENTER' : 'MAX';
//             }
//         }
//     }
// }

