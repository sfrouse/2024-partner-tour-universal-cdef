import * as contentful from 'contentful';
import {
    contentfulInstanceToDefinitionInstance,
} from '@contentful-demos/component-definitions/dist/index.js';
import createFigmaInstanceFromCDef from './createFigmaInstanceFromCDef.js';

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

    const figmaInstance = await createFigmaInstanceFromCDef(
        defInstance, cDefRootUrl, figmaParentNode, resizeFunk, isRoot, entry
    );

    return figmaInstance;
}