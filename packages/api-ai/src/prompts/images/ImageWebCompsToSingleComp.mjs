import config from "../../config.mjs";
import createLitElementWithDSysComps from "../../systems/systems/designSystem/createLitElementWithDSysComps.mjs";
import webCompInstanceSystem from "../../systems/systems/webComps/webCompInstanceSystem.mjs";
import designSystemTemplate from "../../templates/designSystemTemplate.mjs";
import renderFollowUpResults from "../utils/renderFollowUpResults.mjs";

const imageWebCompsToSingleComp = {
    name: 'Image Web Comps to Single Comp',
    id: 'imageWebCompsToSingleComp',
    prompts: async () => {

      let imageToHTML;
      try {
        imageToHTML = await import(
          '../../generatedCode/imageToHTMLToWebComps.json',
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
            await createLitElementWithDSysComps.prompt(),
            {
                "role": "user",
                "content": `
                Can you take these custom web components and wrap them into a single, reusable lit elements web component.
                Make sure to create attributes for each piece of text content you find.
              
                \`\`\`
                ${imageToHTML.default[0]}
                \`\`\`
                
                `,
            }
          ],
          temperature: config.OPEN_AI_TEMPERATURE,
          max_tokens: config.OPEN_AI_MAX_TOKENS,
          top_p: config.OPEN_AI_TOP_P,
        },
        {
            model: config.OPEN_AI_MODEL,
            messages: [
                await webCompInstanceSystem.prompt(),
                {
                    "role": "user",
                    "content": `
                        Create an instance of this new web component.`,
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
        designSystemTemplate(`<!-- WEB COMPONENT CODE -->
<script type="module">
    ${action.results[0]}
</script>

<!-- INSTANCE -->
${action.results[1]}`)
      );
    }
};

export default imageWebCompsToSingleComp;