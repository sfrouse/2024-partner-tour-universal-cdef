import htmlCssExpertSystem from "../../systems/htmlCssExpertSystem.mjs";
import getCSSTokensPrompt from "../utils/getTokensPrompt.mjs";
import config from '../../config.mjs';

const imageToHTMLToTokens = {
    name: 'Image...to Tokens',
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
                htmlCssExpertSystem,
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
        if (!action.results) return '';
        return `
<link rel="stylesheet" href="${config.TOKENS_CSS}">

<!-- HTML -->
${action.results[0]}

`;

    }
};

export default imageToHTMLToTokens;