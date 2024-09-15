import loadImportFileAsText from './loadImportFileAsText.mjs';

export default async function getCSSTokensPrompt() {
    const tokens = await loadImportFileAsText('@contentful-demos', 'design-tokens/dist/tokens.css');
    return tokens
}