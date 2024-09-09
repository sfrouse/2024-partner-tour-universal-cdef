import findTokenValue from "./findTokenValue.js";
import { nameToCSSRoot } from "./nameToCssRoot.js";

export default async function hydrateTokens(
    tokens, prefix
) {
    const hydratedTokens = {};
    for (const collection of tokens.collections) {
        for (const mode of collection.modes) {
            for (const token of mode.tokens) {
                const {
                    keys,
                    cssRoot,
                    globalKey,
                    hydratedToken
                } = createKeys(
                    token,
                    prefix,
                    hydratedTokens
                );
                
                // OUTPUT
                if (!hydratedToken.outputs[mode.name]) hydratedToken.outputs[mode.name] = {};

                let tokenValue = findTokenValue(token);
                let figmaValue = tokenValue;
                if (tokenValue.type === 'VARIABLE_ALIAS') {
                    tokenValue = `var( --${nameToCSSRoot(tokenValue.variableName, prefix)} )`;
                    figmaValue = `variable:${tokenValue.variableName}`;
                }

                const output = hydratedToken.outputs[mode.name];
                output.figma = `set ${keys.figma} = ${figmaValue};`;
                output.css = `--${cssRoot}: ${tokenValue};`;
                output.scss = `$${cssRoot}: ${keys.css};`;
                output.js = `${globalKey.toUpperCase()}: '${keys.css}',`;
                output.option = `${globalKey.toUpperCase()}: '${globalKey}',`;

                const values = hydratedToken.values;
                values.cssProperty = keys.css;
            }
        }
    }

    for (const style of tokens.styles) {
        const {
            keys,
            cssRoot,
            globalKey,
            hydratedToken
        } = createKeys(
            style,
            prefix,
            hydratedTokens
        );

        // OUTPUT
        const output = {};
        hydratedToken.outputs['default'] = output;

        const tokenValue = `var( --${
            nameToCSSRoot(style.fontWeight, prefix)
        } ) var( --${
            nameToCSSRoot(style.fontSize, prefix)
        } )/var( --${
            nameToCSSRoot(style.lineHeight, prefix)
        } ) var( --${
            nameToCSSRoot(style.fontFamily, prefix)
        } )`;
        const figmaValue = {
            weight: `variable:${style.fontWeight}`,
            size: `variable:${style.fontSize}`,
            lineHeight: `variable:${style.lineHeight}`,
            family: `variable:${style.fontFamily}`,
        }

        output.figma = `set ${keys.figma} = ${figmaValue};`;
        output.css = `--${cssRoot}: ${tokenValue};`;
        output.scss = `$${cssRoot}: ${keys.css};`;
        output.js = `${globalKey.toUpperCase()}: '${keys.css}',`;
        output.option = `${globalKey.toUpperCase()}: '${globalKey}',`;

        const values = hydratedToken.values;
        values.cssProperty = keys.css;
        values.figma = figmaValue;
    }

    return hydratedTokens;
}


function createKeys(
    styleOrToken,
    prefix,
    hydratedTokens
) {

    const name = styleOrToken.name;
    const type = styleOrToken.type;

    let globalKey = name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    if (prefix) {
        globalKey = `${prefix}_${globalKey}`;
    }
    if (!hydratedTokens[globalKey]) {
        hydratedTokens[globalKey] = {keys:{}, outputs:{}, values:{}};
    }
    const hydratedToken = hydratedTokens[globalKey];

    // ROOTS
    const cssRoot = nameToCSSRoot(name, prefix);

    // KEYS
    const keys = hydratedToken.keys;
    keys.global = globalKey;
    keys.css = `var(--${cssRoot})`;
    if (type === 'textStyle') {
        const style = styleOrToken;
        keys.figma = `style:${name}`;
        keys.figmaComposite = {
            weight: `variable:${style.fontWeight}`,
            size: `variable:${style.fontSize}`,
            lineHeight: `variable:${style.lineHeight}`,
            family: `variable:${style.fontFamily}`,
        }
    }else{
        keys.figma = `variable:${name}`;
    }
    keys.js = globalKey.toUpperCase();

    return {keys, cssRoot, globalKey, hydratedToken};
}