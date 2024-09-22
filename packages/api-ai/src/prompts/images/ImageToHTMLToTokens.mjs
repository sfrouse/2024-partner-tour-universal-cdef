import htmlCssExpertSystem from "../../systems/systems/htmlCssExpertSystem.mjs";
import getCSSTokensPrompt from "../utils/getTokensPrompt.mjs";
import config from '../../config.mjs';
import renderFollowUpResults from "../utils/renderFollowUpResults.mjs";
import designSystemTemplate from "../../templates/designSystemTemplate.mjs";

const imageToHTMLToTokens = {
    name: 'Image Results to Tokens',
    id: 'imageToHTMLToTokens',
    prompts: async () => {

      const tokens = await getCSSTokensPrompt();
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
            model: "gpt-4o",
            messages: [
                await htmlCssExpertSystem.prompt(),
                {
                    "role": "user",
                    "content": `
                    
                    Can you update this HTML to use the css custom properties below.
                  
                    \`\`\`
                    ${imageToHTML.default[0]}
                    \`\`\`

                    Tokens:
                    \`\`\`
                    ${tokens}
                    \`\`\``,
                }
            ],
            temperature: 0,
            max_tokens: 1000,
            top_p: 1,
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

export default imageToHTMLToTokens;