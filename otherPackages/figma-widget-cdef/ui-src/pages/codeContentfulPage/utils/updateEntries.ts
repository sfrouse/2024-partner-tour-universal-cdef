import {
    CDefInstance,
    getComponentDefinition
} from "@contentful-demos/component-definitions/dist/index.js";
import * as contentful from 'contentful-management';

export default async function updateEntries(
    cdefInstance: CDefInstance,
    ctflCMAKey: string,
    spaceId: string,
    environmentId: string,
    cDefRootUrl: string,
) {
    const compDefinition = await getComponentDefinition(
        cDefRootUrl,
        cdefInstance.$schema as string
    );
    if (!compDefinition) {
        console.error(
            `[updateEntries] Component Definition not found`,
            cDefRootUrl,
            cdefInstance.$schema
        );
        return;
    }

    const client = contentful.createClient({
        accessToken: ctflCMAKey
    });

    // Fetch the space and environment
    const space = await client.getSpace(spaceId);
    const environment = await space.getEnvironment(environmentId);

    let ctfEntry : contentful.Entry;

    // Check if the Contentful ID exists in the cdefInstance
    if (!cdefInstance.$identifier?.contentful) {
        // If not, create a new entry
        return createNewEntry(
            cdefInstance,
            cDefRootUrl,
            environment
        );
    } else {
        // If the entry exists, fetch it by ID
        try {
            ctfEntry = await environment.getEntry(cdefInstance.$identifier.contentful);
        } catch (error) {
            return createNewEntry(
                cdefInstance,
                cDefRootUrl,
                environment
            );
        }
    }

    const cdefInstancePropValues = {...cdefInstance};
    const promiseArr: any[] = [];

    if (!ctfEntry) {
        console.log('ctfEntry MISSING', ctfEntry);
        return;
    }
    // Loop through the entry fields and update or recursively process slots
    Object.entries(ctfEntry.fields).map((entry: any) => {
        const propName = entry[0];
        const cdefInstanceProp = cdefInstance[propName];
        const cdefProp = compDefinition.properties[propName];
        if (cdefProp) {
            if (cdefProp.type === 'array') {
                // Handle slots (arrays of child components)
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
                        );
                    });
                }
            } else {
                // Handle normal properties
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

    return ctfEntry;
}

async function createNewEntry(
    cdefInstance: CDefInstance,
    cDefRootUrl: string,
    environment: contentful.Environment
) {
    console.log('[createNewEntry] creating', cdefInstance);
    let ctfEntry: contentful.Entry;
    try {
        if (cdefInstance.$identifier.contentful && cdefInstance.$identifier.contentful.length > 0) {
            ctfEntry = await environment.getEntry(cdefInstance.$identifier.contentful);
            // Check if the entry is archived or deleted (invalid case)
            if (!ctfEntry.sys || ctfEntry.sys.archivedAt || ctfEntry.sys.deletedAt) {
                throw new Error('Entry is invalid (archived or deleted).');
            }
            console.log('[createNewEntry] Found entry, skipping create', ctfEntry);
            return ctfEntry;
        }
    } catch (error) {
        // nada 
    }

    const compDefinition = await getComponentDefinition(
        cDefRootUrl,
        cdefInstance.$schema as string
    );
    const fields: { [key: string]: any } = {};
    const cdefInstancePropValues = { ...cdefInstance };
    const tag = compDefinition['x-cdef'].tag;

    // Loop through the properties and add fields if "content": true
    if (compDefinition.properties) {

        for (const propName of Object.keys(compDefinition.properties)) {
            const propertyDefinition = compDefinition.properties[propName];
            const value = cdefInstancePropValues[propName];

            // Check if the property has the "content": true flag
            const hasContentFlag = propertyDefinition?.['x-cdef']?.['output']?.['content']?.['content'] === true;
            const isArray = propertyDefinition?.['type'] === 'array';

            if (hasContentFlag && !isArray) {
                // Handle single value properties
                delete cdefInstancePropValues[propName];
                const finalValue = value ? `${value}`.trim() : `${tag} - ${Date.now()}`;
                // con sole.log(`propName(${propName}) value(${value}) finalValue(${finalValue})`);
                fields[propName] = { 'en-US': finalValue };
            } 
            
            if (isArray && Array.isArray(value)) {
                // Handle array properties (recursive updates for child instances)
                delete cdefInstancePropValues[propName];
                fields[propName] = { 'en-US': [] };
                for (const childCDefInstance of value) {
                    const childEntry = await createNewEntry(
                        childCDefInstance,
                        cDefRootUrl,
                        environment
                    );
                    fields[propName]['en-US'].push({
                        sys: { id: childEntry.sys.id, linkType: 'Entry', type: 'Link' }
                    });
                }
            }
        }

        // Add any remaining componentInstance fields
        fields.componentInstance = { 'en-US': cdefInstancePropValues };
    }

    // Create the entry in Contentful
    ctfEntry = await environment.createEntry(tag, { fields });
    cdefInstance.$identifier = { contentful: ctfEntry.sys.id }; // Store the new entry ID
    return ctfEntry;
}

