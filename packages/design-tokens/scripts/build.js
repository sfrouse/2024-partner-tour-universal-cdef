import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import hydrateTokens from './utils/hydrateTokens.js'
import semanticTokens from './utils/semanticTokens.js';

export default async function build() {
    const fontsUrl = 'https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,100..900;1,100..900&display=swap';
    const demoTokens = await loadRelativePathJSON('../tokens/dmo.tokens.json');

    const prefix = 'wc';
    const hydratedTokens = await hydrateTokens(
        demoTokens, prefix
    );
    const dest = _relativeToAbsolutPath('../dist')

    if (!fs.existsSync(dest)){
        fs.mkdirSync(dest, { recursive: true });
    }
    await fs.promises.writeFile(
        `${dest}/hydratedTokens.json`,
        `${JSON.stringify(hydratedTokens, null, 2)}`
    );

    const finalCSS = [];
    const finalSCSS = [];
    const finalJS = [];
    const finalJSOptions = [];
    const finalFigma = [];
    const finalSemantic = [];
    const lookup = {
        tokens: [],
        lookup: {}
    }
    Object.values(hydratedTokens).map(token => {
        Object.values(token.keys).map(keyValue => {
           lookup.lookup[keyValue] = lookup.tokens.length;
        });
        lookup.tokens.push({
            ...token.keys
        });
        Object.entries(token.outputs).map((entry, index) => {
            // const name = entry[0];
            if (
                // name === 'default' ||
                // name === 'light' ||
                // name === 'desktop'
                index === 0 // can't depend on this necessarily...
            ) {
                const output = entry[1];
                finalCSS.push(output.css);
                finalSCSS.push(output.scss);
                finalJS.push(output.js);
                finalJSOptions.push(output.option);
                finalFigma.push(output.figma);
                if (output.semantic) {
                    finalSemantic.push(output.semantic);
                }
            }
        })
    });

    await fs.promises.writeFile(
        `${dest}/tokens.css`,
        `@import url('${fontsUrl}');\n\n:root, .light {\n\t${finalCSS.join('\n\t')}\n}`
    );

    await fs.promises.writeFile(
        `${dest}/tokens.scss`,
        `${finalSCSS.join('\n')}`
    );

    await fs.promises.writeFile(
        `${dest}/tokens.ts`,
        `const design = {\n\t${finalJS.join('\n\t')}\n};\nexport default design;`
    );

    await fs.promises.writeFile(
        `${dest}/tokenOptions.ts`,
        `const designOptions = {\n\t${finalJSOptions.join('\n\t')}\n};\nexport default designOptions;`
    );

    await fs.promises.writeFile(
        `${dest}/tokens.fig.txt`,
        `${finalFigma.join('\n')}`
    );

    await fs.promises.writeFile(
        `${dest}/tokensLookup.json`,
        `${JSON.stringify(lookup, null, 2)}`
    );

    // SEMANTIC
    const semantic = semanticTokens(hydratedTokens, prefix);
    await fs.promises.writeFile(
        `${dest}/semantic.ts`,
        `const semantic = ${JSON.stringify(semantic, null, 2)};\nexport default semantic;`
    );
}

async function loadRelativePathJSON(localPath) {
    try {
        // const currentDir = path.dirname(fileURLToPath(import.meta.url));
        const relativePath = _relativeToAbsolutPath(localPath);// `${currentDir}/${localPath}`;
        const data = await fs.promises.readFile(relativePath, 'utf8');
        const jsonData = JSON.parse(data);
        return jsonData;
    } catch (err) {
        console.error('Error reading JSON file:', err);
    }
}

function _relativeToAbsolutPath(localPath) {
    const currentDir = path.dirname(fileURLToPath(import.meta.url));
    return `${currentDir}/${localPath}`;
}

build();