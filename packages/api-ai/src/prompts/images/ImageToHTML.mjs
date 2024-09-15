import processImageToHTMLSystem from "../../systems/processImageToHTMLSystem.mjs";

const imageToHTML = {
    name: 'Image to HTML',
    id: 'imageToHTML',
    prompts: async () => {
        return [
            {
                type: "claude",
                model: "claude-3-opus-20240229",
                max_tokens: 1000,
                temperature: 0,
                system: processImageToHTMLSystem.content,
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
        if (!action.results) return '';
        return action.results[0];
    }
};

export default imageToHTML;