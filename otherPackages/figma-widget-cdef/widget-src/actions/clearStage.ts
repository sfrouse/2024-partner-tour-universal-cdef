import findWidgetSiblings from "./findWidgetSiblings.js";



export default function clearStage(nodeId: string) {
    const siblings = findWidgetSiblings(nodeId);

    // Clear the canvas
    siblings.map(child => {
        child.remove();
    });
}