import isObject from "../../shared-src/isObject.js";
import { MessageRequest } from "../../shared-src/types.js";
import bounceBack from "../utils/postMessagePromise.js";

type StorageRequest = {
    promiseId: string,
    request: MessageRequest,
    properties: string[] | {[key: string]: string}
};

// FILE
export function saveToFileStorage(message: StorageRequest) {
    const properties = message.properties;
    if (properties && isObject(properties)) {
        Object.entries(properties).map((entry) => {
            return figma.root.setPluginData(entry[0], `${entry[1]}`);
        })
    }
    bounceBack(message, {});
}

export function getFromFileStorage(propNames: string[]) {
    const properties: {[key:string]: string} = {};
    if (propNames && Array.isArray(propNames)) {
        propNames.map(name => {
            const value = figma.root.getPluginData(name);
            properties[name] = value;
        });
    }
    return properties;
}

export function getFromFileStorageBounce(message: StorageRequest) {
    const properties = getFromFileStorage(message.properties as string[]);
    bounceBack(message, {properties});
}

export function clearAllFileStorage() {
    const keys = figma.root.getPluginDataKeys();
    keys.map(key => {
        figma.root.setPluginData(key, '');
    })
}

// CLIENT
export async function saveToClientStorage(message: StorageRequest) {
    const properties = message.properties;
    if (properties && isObject(properties)) {
        await Promise.all(
            Object.entries(properties).map((entry) => {
                // cons ole.log('[CLIENT STORAGE] Saving', entry);
                return figma.clientStorage.setAsync(entry[0], `${entry[1]}`);
            })
        );
    }
    bounceBack(message, {});
}

export async function getFromClientStorage(propNames: string[]) {
    const properties: {[key:string]: string} = {};
    if (propNames && Array.isArray(propNames)) {
        await Promise.all(
            propNames.map(name => {
            return (async () => {
                const value = await figma.clientStorage.getAsync(name);
                properties[name] = value;
            })();
            })
        );
    }
    return properties;
}

export async function getFromClientStorageBounce(message: StorageRequest) {
    const properties = await getFromClientStorage(message.properties as string[]);
    bounceBack(message, {properties});
}

export async function clearAllClientStorage() {
    const keys = await figma.clientStorage.keysAsync();
    await Promise.all(
        keys.map(key => {
            return figma.clientStorage.deleteAsync(key);
        })
    );
}

// WIDGET
export function saveToWidgetStorage(
    message: StorageRequest,
    widgetNode: WidgetNode
) {
    const properties = message.properties;
    if (widgetNode && properties && isObject(properties)) {
        Object.entries(properties).map((entry) => {
            return widgetNode.setPluginData(entry[0], `${entry[1]}`);
        })
    }
    bounceBack(message, {});
}

export function getFromWidgetStorage(
    propNames: string[],
    widgetNode: WidgetNode,
) {
    const properties: {[key:string]: string} = {};
    if (widgetNode && propNames && Array.isArray(propNames)) {
        propNames.map(name => {
            const value = widgetNode.getPluginData(name);
            properties[name] = value;
        });
    }
    return properties;
}

export function getFromWidgetStorageBounce(
    message: StorageRequest,
    widgetNode: WidgetNode,
) {
    const properties = getFromWidgetStorage(message.properties as string[], widgetNode);
    bounceBack(message, {properties});
}

export function clearAllWidgetStorage(widgetNode: WidgetNode) {
    if (!widgetNode) return;
    const keys = widgetNode.getPluginDataKeys();
    keys.map(key => {
        widgetNode.setPluginData(key, '');
    })
}