import config from "../../config.mjs";
import designSystemComponentsSystem from "../../systems/systems/designSystem/designSystemComponentsSystem.mjs";
import designSystemTemplate from "../../templates/designSystemTemplate.mjs";
import getCDefsPrompt from "../../utils/getCDefsPrompt.mjs";
import renderFollowUpResults from "../utils/renderFollowUpResults.mjs";

const imageToHTMLToWebComps = {
    name: 'Image Results to Web Comps',
    id: 'imageToHTMLToWebComps',
    prompts: async () => {

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
              await designSystemComponentsSystem.prompt(),
              {
                  "role": "user",
                  "content": `
                    Can you update this HTML to use the custom web components below.
                    Try to keep everything as close as possible to the original.
                  
                    \`\`\`
                    ${imageToHTML.default[0]}
                    \`\`\`
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

export default imageToHTMLToWebComps;