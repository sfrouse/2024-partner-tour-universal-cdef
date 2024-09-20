import {
    CDefInstance,
    getComponentDefinition
} from "@contentful-demos/component-definitions/dist/index.js";
import * as contentful from 'contentful-management';

export default async function updateEntries(
    // entryId: string,
    cdefInstance: CDefInstance,
    ctflCMAKey: string,
    spaceId: string,
    environmentId: string,
    cDefRootUrl: string,
) {
    const compDefinition = await getComponentDefinition(cDefRootUrl, cdefInstance.$schema as string );
    if (!compDefinition) {
        console.error(
            `[createFigmaInstanceFromCDef] Component Definition not found`,
            cDefRootUrl,
            cdefInstance.$schema
        );
        return;
    }
    
    const client = contentful.createClient({
        accessToken: ctflCMAKey
    });

    // Fetch the space and environment
    const space = await client.getSpace(spaceId); // Replace with your space ID
    const environment = await space.getEnvironment(environmentId); // Replace with your environment ID
    
    // Get the entry by ID
    if (!cdefInstance.$identifier.contentful) {
        console.error('no contentful id on cdefInstance', cdefInstance);
        return;
    }
    const ctfEntry = await environment.getEntry(cdefInstance.$identifier.contentful);

    const cdefInstancePropValues = {...cdefInstance};
    const promiseArr: any[] = [];
    Object.entries(ctfEntry.fields).map((entry: any) => {
        const propName = entry[0];
        // const prop = entry[1];
        const cdefInstanceProp = cdefInstance[propName];
        console.log('cdefInstanceProp', cdefInstanceProp);
        const cdefProp = compDefinition.properties[propName];
        if (cdefProp) {
            // if (Array.isArray(cdefInstanceProp)) {
            if (cdefProp.type === 'array') {
                // it's a slot...
                delete cdefInstancePropValues[propName];
                if (Array.isArray(cdefInstanceProp)) {
                    cdefInstanceProp.map(childCdefInst => {
                        promiseArr.push(
                            updateEntries(
                                childCdefInst,
                                ctflCMAKey,
                                spaceId,
                                environmentId,
                                cDefRootUrl
                            )
                        )
                    })
                }
            }else{
                ctfEntry.fields[propName]['en-US'] = cdefInstanceProp;
            }
        }
    });

    if (ctfEntry.fields.componentInstance) {
        ctfEntry.fields.componentInstance['en-US'] = cdefInstancePropValues;
    }

    await Promise.all(promiseArr);

    // Update the entry (save changes)
    await ctfEntry.update();
}