import loadImportFileAsText from '../systems/systems/utils/loadImportFileAsText.mjs';

export default async function getCDefsPrompt() {
    // Load the manifest file as text and then parse it to JSON
    const cdefs = await loadImportFileAsText('@contentful-demos', 'web-components/dist/cdef/manifest.json');
    const cdefsJson = JSON.parse(cdefs);

    const definitions = cdefsJson.definitions;

    let allDefinitionsString = ''; // Store all definition contents in this string

    // Iterate over each definition and load its 'id' file
    for (const key in definitions) {
        if (definitions.hasOwnProperty(key)) {
            const definition = definitions[key];
            const definitionId = definition.id; // This is the file name, e.g. "dmo-button.cdef.json"
            
            // Load the definition file as text
            const definitionContent = await loadImportFileAsText('@contentful-demos', `web-components/dist/cdef/${definitionId}`);

            const dContentJSON = JSON.parse(definitionContent);
            const className = dContentJSON['x-cdef'].className;
            const tag = dContentJSON['x-cdef'].tag;

            const aiContent = await loadImportFileAsText('@contentful-demos', `web-components/dist/cdef/${tag}/${className}.ai.txt`);

            // Append the loaded definition to the final string
            // allDefinitionsString += `\n${definitionContent}`;
            allDefinitionsString += `\n${aiContent}`;
        }
    }

    // Return or process the final concatenated string
    return allDefinitionsString;
}