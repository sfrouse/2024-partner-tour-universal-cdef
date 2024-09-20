import { CDefInstance } from '@contentful-demos/component-definitions';
import * as contentful from 'contentful';
import {
    definitionInstanceToFigmaInstance,
    getComponentDefinition,
    schemaToIdentifier,
    applyProperties
} from '@contentful-demos/component-definitions/dist/index.js';
import { processSlots } from '../processSlots.js';
// import {
//     applyLayoutModeAndFixedSizes,
//     applyResizing
// } from '../processSlots/applyLayout.js';
import { 
    isDefaultSlotDefinition,
    hasLayoutDefinition
} from '../processSlots/isLayoutWithDefaultSlot.js';

export default async function createFigmaInstanceFromCDef(
    defInstance: CDefInstance | undefined,
    cDefRootUrl: string | undefined,
    figmaParentNode: FrameNode | ComponentNode,
    resizeFunk?: (figmaInstance: InstanceNode) => void,
    isRoot: boolean = true,
    entry?: contentful.Entry | undefined, // legacy...
) : Promise<InstanceNode | undefined> {

    if (!defInstance || !cDefRootUrl) {
        console.error('entry and cDefRootUrl required');
        return;
    }

    // ========= STRT NEW =========
    const figmaInstanceV2 = definitionInstanceToFigmaInstance(
        defInstance, cDefRootUrl, figmaParentNode, figma
    );
    if (figmaInstanceV2) {
        return figmaInstanceV2;
    };// !!!!!!!!!!!!!!!!!!!!!!!!!!!
    // ========= END NEW =========

    // Component Definition from Definition Instance
    const compDefinition = await getComponentDefinition(cDefRootUrl, defInstance.$schema as string );
    if (!compDefinition) {
        console.error(`[createFigmaInstanceFromCDef] Component Definition not found`, cDefRootUrl, defInstance.$schema);
        return;
    }

    // Figma Component
    const figmaCompName = schemaToIdentifier(defInstance.$schema as string);
    let figmaComponentSource = figma.root.findOne(node => 
        node.name === figmaCompName &&
        ( node.type === "COMPONENT"  || node.type === "COMPONENT_SET" )
    );
    if (!figmaComponentSource) {
        console.error(`[createFigmaInstanceFromCDef] Component not found named "${figmaCompName}"`)
        return;
    }

    const hasLayout = hasLayoutDefinition(compDefinition);
    const hasDefaultSlot = isDefaultSlotDefinition(compDefinition);
    const isComponentClone = hasLayout && hasDefaultSlot;
    if (isComponentClone) {
        figmaComponentSource = figmaComponentSource.clone();
    }
    
    // Figma Instance
    let figmaInstance,
        figmaComponent: ComponentNode | undefined,
        compPropDefs : any;
    if (figmaComponentSource.type === 'COMPONENT_SET') {
        figmaComponent = figmaComponentSource.defaultVariant;
        figmaInstance = figmaComponentSource.defaultVariant.createInstance();
        compPropDefs = figmaComponentSource.componentPropertyDefinitions;
    }else if (figmaComponentSource.type === 'COMPONENT'){
        figmaComponent = figmaComponentSource;
        figmaInstance = figmaComponentSource.createInstance();
        compPropDefs = figmaComponentSource.componentPropertyDefinitions;
    }
    if (!figmaInstance || !figmaComponent) return;

    // Append
    figmaParentNode.appendChild(figmaInstance);

    // Props
    applyProperties(
        figmaInstance,
        defInstance,
        compPropDefs
    );

    // Slots
    // TODO: figure out how to do this with cdefs alone...
    if (entry) {
        await processSlots(
            compDefinition,
            figmaComponent,
            figmaInstance,
            entry,
            cDefRootUrl,
            defInstance,
            isComponentClone
        );
    }

    if (resizeFunk) {
        resizeFunk(figmaInstance);
    }

    if (isComponentClone) {
        figmaComponentSource.remove();
    }
    return figmaInstance;
}