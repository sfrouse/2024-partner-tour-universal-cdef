import { CDefDefinition } from "@contentful-demos/component-definitions";


// export default function isLayoutWithDefaultSlot(
//     compDefinition: CDefDefinition
// ) {
//     let isLayoutSlotted = false;
//     if (compDefinition.properties) {
//         let hasDefaultSlot = false;
//         let hasLayout = false;
//         Object.values(compDefinition.properties).find((prop: CDefDefinition) => {
//             if (
//                 prop['x-cdef']?.output?.webComponent?.slot === true &&
//                 prop['x-cdef']?.output?.webComponent?.defaultSlot === true
//             ) {
//                 hasDefaultSlot = true;
//             }
//             if (prop['x-cdef']?.input?.inputType === 'layout') {
//                 hasLayout = true;
//             }
//             if (hasLayout && hasDefaultSlot) {
//                 isLayoutSlotted = true;
//                 return true;
//             }
//             return false
//         });
//     }
//     return isLayoutSlotted;
// }

export function hasLayoutDefinition(
    compDefinition: CDefDefinition
) {
    let isLayout = false;
    if (compDefinition.properties) {
        Object.values(compDefinition.properties).find((prop: CDefDefinition) => {
            if (prop['x-cdef']?.input?.inputType === 'layout') {
                isLayout = true;
                return true;
            }
            return false
        });
    }
    return isLayout;
}

export function isDefaultSlotDefinition(
    compDefinition: CDefDefinition
) {
    let hasDefaultSlot = false;
    if (compDefinition.properties) {
        Object.values(compDefinition.properties).find((prop: CDefDefinition) => {
            if (
                prop['x-cdef']?.output?.webComponent?.slot === true &&
                prop['x-cdef']?.output?.webComponent?.defaultSlot === true
            ) {
                hasDefaultSlot = true;
                return true;
            }
            return false
        });
    }
    return hasDefaultSlot;
}