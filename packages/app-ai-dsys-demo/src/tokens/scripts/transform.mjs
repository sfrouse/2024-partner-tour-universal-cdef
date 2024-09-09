import fs from 'fs';
import path from 'path';
import transformTokens from "./transformTokens.mjs";
import areTokenSchemasIdentical from "./utils/areTokenSchemasIdentical.mjs";
import { fileURLToPath } from 'url';

export default function transform() {
    (async () => {

        const demoTokens = await loadRelativePathJSON('../tokens/dmo.tokens.json');
        const contentfulTokens = await loadRelativePathJSON('../tokens/ctfl.tokens.json');
        if (!demoTokens || !contentfulTokens) {
            console.error('Error: could not load the token files.');
            return;
        }

        const errors = areTokenSchemasIdentical(
            demoTokens,
            contentfulTokens
        );
        if (errors.length > 0) {
            console.error('Error: tokens are not the same', errors);
            return;
        }

        await transformTokens(
            demoTokens,
            'dmo',
            _relativeToAbsolutPath('../dist/dmo')
        );
        await transformTokens(
            contentfulTokens,
            'dmo', // it's a theme...values are only difference
            _relativeToAbsolutPath('../dist/ctfl')
        );
    })();
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
 
transform();