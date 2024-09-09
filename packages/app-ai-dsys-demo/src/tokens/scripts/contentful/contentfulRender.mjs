import fs from 'fs';

export default function contentfulRender(
    dest, writeFileArr, contentfulTokens
) {
    const ctflDir = `${dest}/contentful`;
    if (!fs.existsSync(ctflDir)){
        fs.mkdirSync(ctflDir, { recursive: true });
    }
    writeFileArr.push(fs.promises.writeFile(
        `${ctflDir}/tokens.ts`,
        `import { DesignTokensDefinition } from "@contentful/experiences-core/dist/types";

const tokens: DesignTokensDefinition = ${JSON.stringify(contentfulTokens, null, 2)};\nexport default tokens;`
    ));
}