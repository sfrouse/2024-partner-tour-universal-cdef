import processImageToHTMLSystem from "../../systems/systems/processImageToHTMLSystem.mjs";
import renderFollowUpResults from "../utils/renderFollowUpResults.mjs";

const imageToHTML = {
    name: 'Image to HTML (claude)',
    id: 'imageToHTML',
    prompts: async () => {
        return [
            {
                type: "claude",
                model: "claude-3-opus-20240229",
                max_tokens: 1000,
                temperature: 0,
                system: (await processImageToHTMLSystem.prompt()).content,
                messages: [
                  {
                    role: "user",
                    content: [
                      {
                        type: "LAST_UPLOADED_IMAGE"
                      },
                      {
                        type: "text",
                        text: `
                          Can you produce HTML from this image of a web page?`
                      }
                    ]
                  }
                ]
              }
        ]
    },
    render: async (action) => {
      // CANT DO THIS WITH CLAUDE
      // return renderFollowUpResults(
      //   action,
      //   action.results[0]
      // );
      return action.results[0];
    }
};

export default imageToHTML;