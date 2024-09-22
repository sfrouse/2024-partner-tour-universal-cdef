import htmlCssExpertSystem from "../../systems/systems/htmlCssExpertSystem.mjs";
import getCDefsPrompt from "../utils/getCDefsPrompt.mjs";
import getCSSTokensPrompt from "../utils/getTokensPrompt.mjs";
import config from '../../config.mjs';
import designSystemTemplate from "../../templates/designSystemTemplate.mjs";
import renderFollowUpResults from "../utils/renderFollowUpResults.mjs";

const imageToHTMLToWebComps = {
    name: 'Image Results to Web Comps',
    id: 'imageToHTMLToWebComps',
    prompts: async () => {

      const cdefs = await getCDefsPrompt();
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
                  
                  Can you update this HTML to use the custom web components and css custom properties below.
                
                  \`\`\`
                  ${imageToHTML.default[0]}
                  \`\`\`

                  Tokens:
                  \`\`\`
                  ${tokens}
                  \`\`\`

                  This is the manifest for all of the components.
                  It is followed by the component definition of each component.
                  Pay attention to how the components can be implemented. 
                  dmo-container is a replacement for div.
                  If you want to render a div, use dmo-container.
                  Do not use inline styles with dmo-container, use it's properties found in it's component definition.
                  You can ignore adding any css to these custom components, they take care of layout entirely.
                    \`\`\`${cdefs}\`\`\`
                  
                  `,
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

export default imageToHTMLToWebComps;