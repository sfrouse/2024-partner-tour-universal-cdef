import htmlCssExpertSystem from "../../systems/systems/htmlCssExpertSystem.mjs";
import renderFollowUpResults from "../utils/renderFollowUpResults.mjs";
import designSystemTemplate from "../../templates/designSystemTemplate.mjs";
import config from "../../config.mjs";
import getTokensRawPrompt from "../../utils/tokens/getTokensRawPrompt.mjs";

const imageToHTMLToRawTokens = {
    name: 'Image Results to Tokens (Raw)',
    id: 'imageToHTMLToRawTokens',
    prompts: async () => {

      const tokens = await getTokensRawPrompt();
      let imageToHTML;
      try {
        imageToHTML = await import(
          '../../generatedCode/imageToHTML.json',
          {
            assert: { type: 'json' },
          }
        );
      }catch(err) {
        console.error(err)
      }
      if (!imageToHTML) {
        return [{
          type: 'message',
          message: "Run Image to HTML first"
        }];
      }

      return [
          {
            model: config.OPEN_AI_MODEL,
            messages: [
                await htmlCssExpertSystem.prompt(),
                {
                    "role": "user",
                    "content": `${[
  `Can you update this HTML to use the css custom properties below.`,
  `Try to keep everything as close as possible to the original.`,
].join(' ')}

\`\`\`
${imageToHTML.default[0]}
\`\`\`

${tokens}

`,
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
        designSystemTemplate(action.results[0])
      );
    }
};

export default imageToHTMLToRawTokens;