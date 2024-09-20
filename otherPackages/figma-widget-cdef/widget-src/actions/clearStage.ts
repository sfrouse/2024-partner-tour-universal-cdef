


export default function clearStage(nodeId: string) {
    const widgetNode = figma.getNodeById(nodeId) as WidgetNode;
    let instanceParent: FrameNode | PageNode | undefined;
    if (widgetNode.parent && widgetNode.parent.type === "FRAME") {
        instanceParent = widgetNode.parent;
    }else{
        instanceParent = figma.currentPage;
    }
    if (!instanceParent) return;

    // Clear the canvas
    instanceParent.children.map(child => {
        if (child !== widgetNode) {
            child.remove();
        }
    });
}