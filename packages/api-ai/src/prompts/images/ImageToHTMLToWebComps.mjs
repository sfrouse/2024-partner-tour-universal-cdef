import htmlCssExpertSystem from "../../systems/htmlCssExpertSystem.mjs";
import textSystem from "../../systems/textSystem.mjs";
import getCDefsPrompt from "../utils/getCDefsPrompt.mjs";
import getCSSTokensPrompt from "../utils/getTokensPrompt.mjs";
import renderAsText from "../utils/renderAsText.mjs";
import config from '../../config.mjs';

const imageToHTMLToWebComps = {
    name: 'Image...to Web Comps',
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
              htmlCssExpertSystem,
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
        if (!action.results) return '';
        return `
<link rel="stylesheet" href="${config.TOKENS_CSS}">
<script type="module" src="${config.WEB_COMPONENTS}"></script> 

${(action.results[0])}

`;

//         return `
// <!-- WEB COMPONENT CODE -->
// <script type="module">
//     ${action.results[0]}
// </script>

// <!-- INSTANCE -->
// ${action.results[1]}

// <!-- TOKENS -->
// <style>
//   ${tokens}
// </style>

// `;

    }
};

export default imageToHTMLToWebComps;