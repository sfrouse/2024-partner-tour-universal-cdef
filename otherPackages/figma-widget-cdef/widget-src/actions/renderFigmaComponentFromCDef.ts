import {
    CDefInstance,
} from "@contentful-demos/component-definitions";
import clearStage from "./clearStage.js";
import { definitionInstanceToFigmaInstance } from "@contentful-demos/component-definitions/dist/index.js";

export default async function renderFigmaComponentFromCDef(
    cdef: CDefInstance | undefined,
    cDefRootUrl: string | undefined,
    nodeId: string 
) {
    console.log('[renderFigmaComponentFromCDef] cdef', cdef);

    if (!cdef) return; 

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
        cdef,
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
