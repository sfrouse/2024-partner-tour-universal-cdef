import {
    CDefInstance,
} from "@contentful-demos/component-definitions";
import createFigmaInstanceFromCDef from "./createFigmaInstance/createFigmaInstanceFromCDef.js";
import clearStage from "./clearStage.js";

export default async function renderFigmaComponentFromCDef(
    cdef: CDefInstance | undefined,
    cDefRootUrl: string | undefined,
    nodeId: string 
) {
    if (!cdef) return; 

    // Find the parent of this widget
    const widgetNode = figma.getNodeById(nodeId) as WidgetNode;
    let instanceParent: FrameNode | PageNode | undefined;
    if (widgetNode.parent && widgetNode.parent.type === "FRAME") {
        instanceParent = widgetNode.parent;
    }else{
        instanceParent = figma.currentPage;
    }
    if (!instanceParent) return;

    // Clear the canvas
    clearStage(nodeId);
    
    // Create New Instance
    const figmaInstance = await createFigmaInstanceFromCDef(
        cdef,
        cDefRootUrl,
        instanceParent as FrameNode
    )

    // Position Under Widget
    if (figmaInstance) {
        figmaInstance.x = widgetNode.x;
        figmaInstance.y = widgetNode.y + widgetNode.height + 20;
    }
}
