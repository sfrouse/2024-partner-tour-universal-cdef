import getCDefsPrompt from "../../utils/getCDefsPrompt.mjs";

export default async function augmentingPromptSystem(previousResults) {
    const cdefs = await getCDefsPrompt();

    return `The content below is formatted content derived from the previous prompt's answers.
        This new request should augment this formatted content and only return that final augmented version.
        Do not add anything extra like "\`\`\`html" or any comments or formatting around it.
        It needs to act exactly like the formatted content.

        \`\`\`
        ${previousResults}
        \`\`\`
        
        If you are asked to change something in a custom web component the definitions below will guide you to what the correct value for each property or attributes should be:
        
        \`\`\`
        ${cdefs}
        \`\`\`
    `;
}