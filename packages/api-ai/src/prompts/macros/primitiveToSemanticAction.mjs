import renderFollowUpResults from "../utils/renderFollowUpResults.mjs";
import designSystemTemplate from "../../templates/designSystemTemplate.mjs";
import config from "../../config.mjs";
import htmlCssExpertSystem from "../../systems/systems/htmlCssExpertSystem.mjs";
import primitiveTokens from "./assets/primitiveTokens.mjs";
import semanticTokensLight from "./assets/semanticTokensLight.mjs";

const primitiveToSemanticAction = {
    name: 'Primitive Tokens to Semantic',
    id: 'primitiveToSemanticAction',
    prompts: async () => {
        return [
          {
            model: config.OPEN_AI_MODEL,
            messages: [
                {
                    "role": "system",
                    "content": [
                        `You are an design system token expert.`,
                        `You answer questions about how design tokens work and generate new tokens on request.`,
                        `The colors are stepped from 100 to 900.`,
                        `Treat the low numbers starting with 100 as dark and the high numbers ending with 900 as light.`,
                        `Try to keep accessibility contrast in mind and assume a white background.`
                        // `Do not give any explanations at all, just give the answers.`
                    ].join(' ')
                },
                {
                    "role": "user",
                    "content": [
                        `Could take the below tokens and apply them to the list of possible tokens below them?`,
                        `
                            \`\`\`
                            ${primitiveTokens}
                            \`\`\`
                        `,
                        `Here is an example of the target tokens.`,
                        `Make sure to have an answer for each of the semantic token specimens.`,
                        `\`\`\`
                            ${semanticTokensLight}
                        \`\`\``,
                    ].join(" "),
                }
            ],
            temperature: config.OPEN_AI_TEMPERATURE,
            max_tokens: config.OPEN_AI_MAX_TOKENS,
            top_p: config.OPEN_AI_TOP_P,
        },
        {
            model: config.OPEN_AI_MODEL,
            messages: [
                await htmlCssExpertSystem.prompt(),
                {
                    "role": "user",
                    "content": [
                        `Could you display the previous semantic token results, only the new semantic tokens,`,
                        `in an HTML table with the name of the new token,`,
                        `the value of that token, a brief description, and a color chip`,
                    ].join(" "),
                }
            ],
            temperature: config.OPEN_AI_TEMPERATURE,
            max_tokens: config.OPEN_AI_MAX_TOKENS,
            top_p: config.OPEN_AI_TOP_P,
        }
      ]
    },
    render: async (action) => {
      return renderFollowUpResults(
        action,
        designSystemTemplate(action.results[1])
      );
    }
};

export default primitiveToSemanticAction;