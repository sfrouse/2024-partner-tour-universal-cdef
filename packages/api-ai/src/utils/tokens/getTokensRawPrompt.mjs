import loadImportFileAsText from '../../prompts/utils/loadImportFileAsText.mjs';

export default async function getTokensRawPrompt() {
    const tokens = await loadImportFileAsText('@contentful-demos', 'design-tokens/dist/tokens.css');
    return `${[
        `This is a list of css custom properties.`,
        `Do not ever render your own css custom properties or make up any new ones.`,
        `Do not ever change or set the values of these custom properties, they will be set elsewhere.`,
    ].join(' ')
}

\`\`\`
${tokens}
\`\`\`
`;
}