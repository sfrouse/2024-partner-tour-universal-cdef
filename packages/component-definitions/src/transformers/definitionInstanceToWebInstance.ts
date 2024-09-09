// import { CDefDesignProperty } from "../decorators/defineComponent";
import { CDefDesignProperty } from "../decorators/defineComponent";
import {
    // CDefDefinition,
    CDefInstance,
    CDefLayout,
    CDefTokenLookup,
    // CDefInstanceImage,
    // CDefInstanceRichText
} from "../types";
import { findCSSViaTokenLookup } from "../utils/findViaTokenLookup";
import getComponentDefinition from "./utils/getComponentDefinition";
import getComponentDefinitionTokenLookup from "./utils/getComponentDefinitionTokenLookup";
import isObject from "./utils/isObject";

// const DESIGN_PROPERTY_ATTR_PREFIX = 'data-cdef-';

export default async function definitionInstanceToWebInstance(
    definitionInst: CDefInstance | undefined,
    cDefPath: string,
    indent: number = 0,
    slotName?: string,
    parentLayout: CDefLayout = CDefLayout.NONE
): Promise<string | void> {

    if (!definitionInst) return;

    const tokenLookup = await getComponentDefinitionTokenLookup(cDefPath);
    const compDefinition = await getComponentDefinition(
        cDefPath,
        definitionInst.$schema as string | undefined
    );
    if (!compDefinition) {
        console.error(`Component Definition not found`, cDefPath, definitionInst.$schema);
        return;
    }
    const tag = compDefinition["x-cdef"]?.tag;
    if (!tag) {
        console.error(`cdef did not have a tag`, cDefPath, compDefinition);
        return;
    }

    const tabs = `\t`.repeat(indent);
    const childTabs = `\t`.repeat(indent+1);
    const grandChildTabs = `\t`.repeat(indent+2);

    const attrs: string[] = [];
    const styles: string[] = [];
    const slots: string[] = [];

    styles.push(`--parent-layout: ${parentLayout};`);

    if (!compDefinition.properties) return;
    await Promise.all(
        Object.entries(compDefinition.properties).map(propertyInfo => {
            return (async() => {
                const name = propertyInfo[0];
                if (name === "$schema") return;
                if (name === "$identifier") return;
                const property = propertyInfo[1];
                const value = definitionInst[name];
                const propXDef = property["x-cdef"];
                const webConfig = propXDef?.output?.webComponent;
                const attrName = webConfig?.attribute || name;
                const isSlot = webConfig?.slot === true;
                const slotName = isSlot ? name : undefined;
                const slotAttr = webConfig?.defaultSlot === true ? '' : ` slot="${slotName}"`;
                const designProp = propXDef?.design === true;
                const layout = getLayout(definitionInst);

                if (value === undefined) return;
    
                // ARRAY
                if (Array.isArray(value)) {
                    const childArr = await Promise.all(
                        value.map(child => {
                            // could this be an array of strings?'
                            return definitionInstanceToWebInstance(
                                child,
                                cDefPath,
                                indent+2,
                                undefined,
                                layout
                            );
                        })
                    );
                    if (isSlot) {
                        if (webConfig?.defaultSlot === true) {
                            slots.push(`${childArr.join(`\n${childTabs}`)}`);
                        }else{
                            slots.push(`${
                                childTabs
                                }<div slot="${slotName}" data-desc="array">${
                                    `\n${grandChildTabs}`}${
                                        childArr.join(`\n${grandChildTabs}`)
                                    }${
                                    `\n${childTabs}`
                                }</div>`);
                        }
                    }else{
                        if (designProp) {
                            toStyles(
                                styles,
                                attrName,
                                childArr.join(''),
                                propXDef,
                                tokenLookup,
                                parentLayout
                            );
                        }else{
                            toAttr(attrs, attrName, childArr.join('\n'));
                        }
                    }

                // OBJECT
                }else if (isObject(value)) {
                    // it is a nested definition instance, possibly slot it
                    if ((value as CDefInstance).$schema !== undefined) {
                        const defValue = await definitionInstanceToWebInstance(
                            value as CDefInstance,
                            cDefPath,
                            indent+1,
                            slotName,
                            layout
                        );
                        if (isSlot) {
                            slots.push(`${childTabs}${defValue}`);
                        }else{
                            if (designProp) {
                            }else{
                                toAttr(attrs, attrName, defValue);
                            }
                        }
                    }else{
                        // it's a raw object of some sort...just stringify it.
                        if (isSlot) {
                            slots.push(`${
                                    childTabs
                                }<div${slotAttr} data-desc="raw object">${
                                    `\n${grandChildTabs}`}${
                                        JSON.stringify(value)
                                    }${
                                    `\n${childTabs}`
                                }</div>`);
                        }else{
                            if (designProp) {
                            }else{
                                toAttr(attrs, attrName, JSON.stringify(value, null, 2));
                            }
                        }
                    }
                }else{
                    if (isSlot) {
                        slots.push(`${
                            childTabs
                            }<div${slotAttr} data-type="string">${
                                `\n${grandChildTabs}`}${
                                    value
                                }${
                                `\n${childTabs}`
                            }</div>`);
                    }else{
                        // no need to add default nor hidden props
                        if (
                            propXDef?.hidden === true
                        ) {
                            return;
                        }
                        if (designProp) {
                            toStyles(
                                styles,
                                attrName,
                                value,
                                propXDef,
                                tokenLookup,
                                parentLayout
                            );
                        }else{
                            toAttr(attrs, attrName, value);
                        }
                    }
                }
            })();
        })
    );

    
    // no tab on starter tab...parent determines tabbing
    return `<${tag} ${
        slotName ? `slot="${slotName}" data-type="webcomp"` : ''
    } ${
        `\n${childTabs}${attrs.join(`\n${childTabs}`)}`
    } ${
        `\n${childTabs}style="
    ${styles.join(`\n${childTabs}`)}"`
    }>${
        slots.length > 0 ? 
            `\n${slots.join(`\n`)}` : ''
    }\n${tabs}</${tag}>`;
}

function toAttr(attrs: string[], attr: string, value: any) {
    if (
        value !== 'false' &&
        value !== false &&
        value !== 'no' &&
        value !== undefined &&
        value !== null
    ) {
        if (value === true) {
            attrs.push(`${attr}`);
        }else{
            attrs.push(`${attr}="${String(value).replace(/"/g, "&quot;")}"`);
        }
    }
}

function toStyles(
    styles: string[],
    name: string,
    value: any,
    propXDef: any,
    tokenLookup?: CDefTokenLookup,
    parentLayout: CDefLayout = CDefLayout.NONE
) {
    const cssPropName = propXDef?.output?.webComponent?.cssProperty || 'missing-css-property';
    const finalValue = findCSSViaTokenLookup(value, tokenLookup);

    // some style props have larger side effects
    if (name === CDefDesignProperty.HORIZONTAL_RESIZING) {
        if (finalValue === 'hug') {
            if (parentLayout === CDefLayout.NONE) {
                styles.push('display: inline-flex;');
            }
        }else if (finalValue === 'fixed') {
        }else if (finalValue === 'fill') {
            if (parentLayout === CDefLayout.NONE) {
                // styles.push('display: inline-flex;');
            }else if (parentLayout === CDefLayout.COLUMN) {
                styles.push(`self-align: stretch;`);
            }else if (parentLayout === CDefLayout.ROW) {
                styles.push(`flex: 1;`);
            }
        }
    }

    if (name === CDefDesignProperty.VERTICAL_RESIZING) {
        if (finalValue === 'hug') {
            if (parentLayout === CDefLayout.NONE) {
            }else if (parentLayout === CDefLayout.COLUMN) {
                styles.push(`flex: 0;`);
            }else if (parentLayout === CDefLayout.ROW) {
            }
        }else if (finalValue === 'fixed') {
        }else if (finalValue === 'fill') {
            if (parentLayout === CDefLayout.NONE) {
                // styles.push('display: inline-flex;');
            }else if (parentLayout === CDefLayout.COLUMN) {
                styles.push(`flex: 1;`);
            }else if (parentLayout === CDefLayout.ROW) {
                styles.push(`self-align: stretch;`);
            }
        }
    }

    const finalStyle = `${cssPropName}: ${finalValue}; /* ${parentLayout} */`;
    if (name === CDefDesignProperty.VERTICAL_RESIZING)
        console.log('CSS FINAL VALUE', value, finalValue, cssPropName);
    if (finalValue) styles.push(finalStyle);
}

function getLayout(
    definitionInst: CDefInstance
): CDefLayout {
    const layoutDirection = definitionInst[CDefDesignProperty.LAYOUT_DIRECTION];
    if (layoutDirection) {
        if (layoutDirection === 'row') {
            return CDefLayout.ROW;
        }
        if (layoutDirection === 'column') {
            return CDefLayout.COLUMN;
        }
    }
    return CDefLayout.NONE;
}