import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as contentful from 'contentful-management';

const ROOT_ENV = resolve(dirname(fileURLToPath(import.meta.url)), '../../../.env');
const COMPONENT_TYPES = ['dmo-button', 'dmo-text', 'dmo-container'];

const env = loadEnv(ROOT_ENV);
const accessToken = env.CONTENTFUL_CMA_TOKEN;
const spaceId = env.CONTENTFUL_SPACE_ID || 'j8zcf2oc2hw1';
const environmentId = env.CONTENTFUL_ENVIRONMENT_ID || 'master';

if (!accessToken) {
    throw new Error(`CONTENTFUL_CMA_TOKEN is missing from ${ROOT_ENV}`);
}

const symbolField = (id, name) => ({
    id,
    name,
    type: 'Symbol',
    localized: false,
    required: false,
    validations: [],
    disabled: false,
    omitted: false,
});

const componentInstanceField = {
    id: 'componentInstance',
    name: 'Component Instance',
    type: 'Object',
    localized: false,
    required: false,
    validations: [],
    disabled: false,
    omitted: false,
};

const bodyField = {
    id: 'body',
    name: 'Body',
    type: 'Array',
    localized: false,
    required: false,
    disabled: false,
    omitted: false,
    items: {
        type: 'Link',
        linkType: 'Entry',
        validations: [{ linkContentType: COMPONENT_TYPES }],
    },
};

const contentTypes = [
    {
        id: 'dmo-button',
        name: 'DMO Button',
        displayField: 'label',
        fields: [
            symbolField('label', 'Label'),
            symbolField('url', 'URL'),
            componentInstanceField,
        ],
    },
    {
        id: 'dmo-text',
        name: 'Demo Text',
        displayField: 'title',
        fields: [
            symbolField('title', 'Internal Label'),
            symbolField('text', 'Text'),
            componentInstanceField,
        ],
    },
    {
        id: 'dmo-container',
        name: 'Demo Container',
        displayField: 'internalLabel',
        fields: [
            symbolField('internalLabel', 'Internal Label'),
            bodyField,
            componentInstanceField,
        ],
    },
];

const client = contentful.default.createClient({ accessToken });
const space = await client.getSpace(spaceId);
const environments = await space.getEnvironments();
const environmentNames = environments.items.map((environment) => environment.sys.id);
if (!environmentNames.includes(environmentId)) {
    throw new Error(
        `Environment "${environmentId}" was not found in space ${spaceId}. Available: ${environmentNames.join(', ')}`
    );
}
const environment = await space.getEnvironment(environmentId);

for (const definition of contentTypes) {
    await ensureContentType(environment, definition);
}

const appDefinition = await findWebComponentsApp(client, space, environment);
if (!appDefinition) {
    console.log('No web-components app is installed. componentInstance keeps the JSON editor.');
} else {
    for (const definition of contentTypes) {
        await assignComponentInstanceEditor(environment, definition.id, appDefinition.sys.id);
    }
    console.log(`Assigned componentInstance to app "${appDefinition.name}" (${appDefinition.sys.id}).`);
}

async function ensureContentType(environment, definition) {
    const existing = await environment.getContentType(definition.id).catch((error) => {
        if (error?.status === 404 || error?.name === 'NotFound') return undefined;
        throw error;
    });

    if (existing && hasExpectedFields(existing, definition)) {
        console.log(`Skipping ${definition.id}; expected fields already exist.`);
        if (!existing.sys.publishedVersion) {
            await existing.publish();
            console.log(`Published ${definition.id}.`);
        }
        return;
    }

    if (!existing) {
        const created = await environment.createContentTypeWithId(definition.id, {
            name: definition.name,
            displayField: definition.displayField,
            fields: definition.fields,
        });
        await created.publish();
        console.log(`Created and published ${definition.id}.`);
        return;
    }

    existing.name = definition.name;
    existing.displayField = definition.displayField;
    existing.fields = mergeFields(existing.fields, definition.fields);
    const updated = await existing.update();
    await updated.publish();
    console.log(`Updated and published ${definition.id}.`);
}

function hasExpectedFields(contentType, definition) {
    if (contentType.displayField !== definition.displayField) return false;
    return definition.fields.every((expected) => {
        const actual = contentType.fields.find((field) => field.id === expected.id);
        if (!actual || actual.type !== expected.type) return false;
        if (expected.id !== 'body') return true;
        const allowed = actual.items?.validations?.find((validation) => validation.linkContentType)?.linkContentType || [];
        return COMPONENT_TYPES.every((typeId) => allowed.includes(typeId));
    });
}

function mergeFields(currentFields, expectedFields) {
    const merged = currentFields.map((field) => ({ ...field }));
    for (const expected of expectedFields) {
        const index = merged.findIndex((field) => field.id === expected.id);
        if (index === -1) {
            merged.push(expected);
        } else {
            merged[index] = { ...merged[index], ...expected };
        }
    }
    return merged;
}

async function findWebComponentsApp(client, space, environment) {
    if (typeof environment.getAppInstallations !== 'function') {
        console.log('This contentful-management client cannot list app installations.');
        return undefined;
    }
    const installations = await environment.getAppInstallations();
    const organizationId = space.sys.organization?.sys?.id;
    if (!organizationId) {
        console.log('Space has no organization id, so installed apps could not be named.');
        return undefined;
    }
    const organization = await client.getOrganization(organizationId);
    const matches = [];
    for (const installation of installations.items) {
        const definitionId = installation.sys.appDefinition?.sys?.id;
        if (!definitionId) continue;
        const definition = await organization.getAppDefinition(definitionId).catch(() => undefined);
        if (!definition) continue;
        const name = definition.name || '';
        if (/web[\s-]*component/i.test(name)) {
            matches.push(definition);
        }
    }
    if (matches.length === 0) return undefined;
    if (matches.length > 1) {
        console.log(`Multiple web-component apps installed (${matches.map((match) => match.name).join(', ')}). Using ${matches[0].name}.`);
    }
    return matches[0];
}

async function assignComponentInstanceEditor(environment, contentTypeId, appDefinitionId) {
    const editorInterface = await environment.getEditorInterfaceForContentType(contentTypeId);
    const controls = editorInterface.controls || [];
    let control = controls.find((item) => item.fieldId === 'componentInstance');
    if (!control) {
        control = { fieldId: 'componentInstance' };
        controls.push(control);
        editorInterface.controls = controls;
    }
    control.widgetNamespace = 'app';
    control.widgetId = appDefinitionId;
    control.settings = {
        ...(control.settings || {}),
        webComponent: contentTypeId,
    };
    await editorInterface.update();
    console.log(`Set ${contentTypeId}.componentInstance editor to the web-components app.`);
}

function loadEnv(filePath) {
    const values = {};
    const text = readFileSync(filePath, 'utf8');
    for (const line of text.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const separator = trimmed.indexOf('=');
        if (separator === -1) continue;
        const key = trimmed.slice(0, separator).trim();
        let value = trimmed.slice(separator + 1).trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }
        values[key] = value;
    }
    return values;
}
