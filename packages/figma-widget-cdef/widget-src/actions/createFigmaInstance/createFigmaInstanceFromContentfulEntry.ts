import * as contentful from 'contentful';
import {
    contentfulInstanceToDefinitionInstance,
    definitionInstanceToFigmaInstance,
    getComponentDefinition,
    schemaToIdentifier
} from '@contentful-demos/component-definitions/dist';
import { applyProperties } from '../applyProperties.js';
import { processSlots } from '../processSlots.js';
import {
    applyLayoutModeAndFixedSizes,
    applyResizing
} from '../processSlots/applyLayout.js';
import { 
    isDefaultSlotDefinition,
    hasLayoutDefinition
} from '../processSlots/isLayoutWithDefaultSlot.js';

export default async function createFigmaInstanceFromContentfulEntry(
    entry: contentful.Entry | undefined,
    cDefRootUrl: string | undefined,
    figmaParentNode: FrameNode | ComponentNode,
    resizeFunk?: (figmaInstance: InstanceNode) => void,
    isRoot: boolean = true
) : Promise<InstanceNode | undefined> {

    if (!entry || !cDefRootUrl) {
        console.error('entry and cDefRootUrl required');
        return;
    }

    // Defintion Instance from Entry
    const defInstance = await contentfulInstanceToDefinitionInstance(
        entry, cDefRootUrl
    );
    if (!defInstance) {
        console.error('defInstance failed');
        return;
    }

    // ========= STRT NEW =========
    const figmaInstanceV2 = definitionInstanceToFigmaInstance(
        defInstance, cDefRootUrl, figmaParentNode, figma
    );
    if (figmaInstanceV2) return;// !!!!!!!!!!!!!!!!!!!!!!!!!!!
    // ========= END NEW =========

    // Component Definition from Definition Instance
    const compDefinition = await getComponentDefinition(cDefRootUrl, defInstance.$schema as string );
    if (!compDefinition) {
        console.error(`Component Definition not found`, cDefRootUrl, defInstance.$schema);
        return;
    }

    // Figma Component
    const figmaCompName = schemaToIdentifier(defInstance.$schema as string);
    let figmaComponentSource = figma.root.findOne(node => 
        node.name === figmaCompName &&
        ( node.type === "COMPONENT"  || node.type === "COMPONENT_SET" )
    );
    if (!figmaComponentSource) {
        console.error(`Component not found named "${figmaCompName}"`)
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

    // Add Layout Plugin Info
    // if (hasLayout) {
    //     setLayoutToStorate(
    //         defInstance,
    //         compDefinition,
    //         figmaInstance
    //     );
    // }

    // Append
    figmaParentNode.appendChild(figmaInstance);

    // Props
    applyProperties(
        figmaInstance,
        defInstance,
        compPropDefs
    );

    // Auto-Layout Properties
    if (isRoot === false) {
        if (hasLayout) {
            applyLayoutModeAndFixedSizes(
                defInstance,
                compDefinition,
                figmaComponent // Component
            );
            // it is not slot here, so no padding or alignments...
            applyResizing(
                defInstance,
                compDefinition,
                figmaInstance  // Instance
            )
        }
    }

    // Slots
    await processSlots(
        compDefinition,
        figmaComponent,
        figmaInstance,
        entry,
        cDefRootUrl,
        defInstance,
        isComponentClone
    );

    if (resizeFunk) {
        resizeFunk(figmaInstance);
    }

    if (isComponentClone) {
        figmaComponentSource.remove();
    }
    return figmaInstance;
}