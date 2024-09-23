import * as contentful from 'contentful';
import {
    contentfulInstanceToDefinitionInstance,
    definitionInstanceToFigmaInstance
} from '@contentful-demos/component-definitions/dist/index.js';
import clearStage from './clearStage.js';

export default async function renderFigmaComponentFromContentfulEntry(
    entry: contentful.Entry | undefined,
    cDefRootUrl: string | undefined,
    nodeId: string
) {
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

    if (!defInstance) return; 

    console.log('[renderFigmaComponentFromContentfulEntry] entry', entry);
    console.log('[renderFigmaComponentFromContentfulEntry] defInstance', defInstance);

    // Find the parent of this widget
    const widgetNode = figma.getNodeById(nodeId) as WidgetNode;
    let instanceParent: FrameNode | undefined;
    if (widgetNode.parent && widgetNode.parent.type === "FRAME") {
        instanceParent = widgetNode.parent;
    }
    if (!instanceParent) return;

    // Clear the canvas
    clearStage(nodeId);
    
    // Create New Instance
    const figmaInstance = await definitionInstanceToFigmaInstance(
        defInstance,
        cDefRootUrl,
        instanceParent as FrameNode,
        figma,
        (figmaInstance: InstanceNode) => {
            if (figmaInstance) {
                figmaInstance.x = widgetNode.x;
                figmaInstance.y = widgetNode.y + widgetNode.height + 20;
            }
        }
    );
    
    instanceParent.resize(
        instanceParent.width,
        figmaInstance.height + 150
    );

    return figmaInstance;
}
