import * as contentful from 'contentful';
import createFigmaInstanceFromContentfulEntry from './createFigmaInstance/createFigmaInstanceFromContentfulEntry.js';

export default async function renderFigmaComponent(
    entry: contentful.Entry | undefined,
    cDefRootUrl: string | undefined,
    nodeId: string
) {
    if (!entry) return;

    // Find the parent of this widget
    const widgetNode = figma.getNodeById(nodeId) as WidgetNode;
    let instanceParent: FrameNode | PageNode | undefined;
    if (widgetNode.parent && widgetNode.parent.type === "FRAME") {
        instanceParent = widgetNode.parent;
    }else{
        instanceParent = figma.currentPage;
    }
    if (!instanceParent) return;

    // Find and remove the exisitng instanc
    const existingInstance = instanceParent.findOne(node => {
        if (node.type !== "INSTANCE") return false;
        const contentfulIdentifier = node.getPluginData('contentfulIdentifier');
        if (contentfulIdentifier === entry.sys.id) return true;
        return false;
    }) as InstanceNode;
    if (existingInstance) {
        existingInstance.remove();
    }

    // Create New Instance
    const figmaInstance = await createFigmaInstanceFromContentfulEntry(
        entry,
        cDefRootUrl,
        instanceParent as FrameNode
    )

    // Position Under Widget
    if (figmaInstance) {
        figmaInstance.x = widgetNode.x;
        figmaInstance.y = widgetNode.y + widgetNode.height + 20;
    }
}
