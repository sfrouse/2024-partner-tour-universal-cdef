import {
    definitionInstanceToWebInstance,
    figmaInstanceToDefinitionInstance
} from "@contentful-demos/component-definitions/dist/index.js";
import { MessageRequest } from "../../shared-src/types.js";
import findWidgetSiblings from "actions/findWidgetSiblings.js";



export default async function stageComponentChange(
    nodeId: string,
    cDefRootUrl: string
) {
    const siblings = findWidgetSiblings(nodeId);
    if (siblings.length === 0) {
        return;
    }

    const stageComponent = siblings[0];

    // CDEF INSTANCE
    const cdefInstance = await figmaInstanceToDefinitionInstance(
        stageComponent,
        cDefRootUrl,
        figma
    );

    // WEB INSTANCE
    let webInstance;
    if (cdefInstance) {
        webInstance = await definitionInstanceToWebInstance(
            cdefInstance,
            cDefRootUrl
        );
    }
    
    figma.ui.postMessage({
        request: MessageRequest.stageComponentChange,
        results: {
            cdefInstance,
            webInstance,
        }
    });
}