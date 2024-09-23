import loadImportFileAsText from '../../prompts/utils/loadImportFileAsText.mjs';

export default async function getTokensSemanticPrompt() {
    const tokens = await loadImportFileAsText('@contentful-demos', 'design-tokens/dist/tokens.simple.txt');
    return `${[
        `This is a list of css custom properties.`,
        `You will have to put "--wc-" back onto the front of each of these custom properties.`,
        `Do not ever render your own css custom properties or make up any new ones.`,
        `Do not ever change or set the values of these custom properties, they will be set elsewhere.`,
    ].join(' ')
}

\`\`\`
${tokens}
\`\`\`
`;
}