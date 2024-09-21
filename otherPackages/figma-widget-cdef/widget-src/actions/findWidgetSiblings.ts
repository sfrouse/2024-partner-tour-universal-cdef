

export default function findWidgetSiblings(nodeId: string) {
    const widgetNode = figma.getNodeById(nodeId) as WidgetNode;
    let instanceParent: FrameNode | PageNode | undefined;
    if (widgetNode.parent && widgetNode.parent.type === "FRAME") {
        instanceParent = widgetNode.parent;
    }else{
        instanceParent = figma.currentPage;
    }
    if (!instanceParent) return [];

    const siblings: SceneNode[] = [];
    instanceParent.children.map(child => {
        if (child !== widgetNode) {
            siblings.push(child);
        }
    });

    return siblings;
}