import loadImportFileAsText from '../../prompts/utils/loadImportFileAsText.mjs';

export default async function getTokensSemanticPrompt() {
    const tokens = await loadImportFileAsText('@contentful-demos', 'design-tokens/dist/tokens.semantic.simple.txt');
    return `${[
        `This is a list of css custom properties organized by where they should be applied.`,
        `For instance 'type_family' should only be used for typography and 'border' is the color of borders.`,
        `You will have to put "--wc-" back onto the front of each of these custom properties.`,
        `All typography decisions should be made using "type" and applied to the "font" css declaration.`,
        `That one semantic token as all size and font information within.`,
        `Do not ever render your own css custom properties or make up any new ones.`,
        `Do not ever change or set the values of these custom properties, they will be set elsewhere.`,
        ].join(' ')
}

\`\`\`
${tokens}
\`\`\`
`;
}