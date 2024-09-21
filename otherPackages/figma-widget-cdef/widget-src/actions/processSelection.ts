import {
  lintFigmaComponent
} from "@contentful-demos/component-definitions/dist/index.js";
import { MessageRequest } from "../../shared-src/types.js";

export default async function processSelection(
  widgetNodeId: string,
) {
  if (figma.currentPage.selection && figma.currentPage.selection.length === 0) {
    figma.ui.postMessage({
      request: MessageRequest.selectionChange,
      results: {
        cdefInstance: undefined,
        webInstance: undefined
      }
    });
  }

  const selectedNode = figma.currentPage.selection[0] as InstanceNode;

  // TODO: brittle...weave into same path as code.tsx
  const widgetNode = figma.getNodeById(widgetNodeId);
  const cDefRootUrl = widgetNode?.getPluginData('cDefRootUrl');
  if (!cDefRootUrl) return;

  if (selectedNode?.type === "INSTANCE") {
    // LINT
    const lintResults = await lintFigmaComponent(
      selectedNode.mainComponent,
      cDefRootUrl,
      figma 
    );

    // Send to UI
    figma.ui.postMessage({
      request: MessageRequest.selectionChange,
      results: {
        // cdefInstance,
        // webInstance,
        lintResults
      }
    });
  }else if (
    selectedNode?.type === "COMPONENT" ||
    selectedNode?.type === "COMPONENT_SET"
  ) {

    let targetNode: ComponentNode | ComponentSetNode | InstanceNode = selectedNode;
    if (selectedNode.type === "COMPONENT") {
      if (selectedNode.parent?.type === "COMPONENT_SET") {
        targetNode = selectedNode.parent;
      }
    }

    // LINT
    const lintResults = await lintFigmaComponent(
      targetNode,
      cDefRootUrl,
      figma
    );

    // Send to UI
    figma.ui.postMessage({
      request: MessageRequest.selectionChange,
      results: {
        lintResults
      }
    });
  }
}