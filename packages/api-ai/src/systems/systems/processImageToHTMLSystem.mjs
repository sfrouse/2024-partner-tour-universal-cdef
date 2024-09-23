
const processImageToHTMLSystem = {
    name: "Process Image to HTML System",
    id: "processImageToHTMLSystem",
    prompt: async () => {
        return {
            "role": "system",
            "content": [
                `Reproduce this image in HTML to look exactly like the image.`,
                `Reproduce as much of the styling as possible.`,
                `Check for fonts that are close.`,
                `Use flex-box exclusively.`,
                `Put all styling in inline style tags using Multiline Formatting every time, even within style attributes.`,
                `Use placeholder images for all places that are images using the service https://placehold.co/600x400.`,
                `I only need the html.`,
                `I do not want any descriptions or explanations.`,
                `I do not want any lead in text presenting the html.`
            ].join(' ')
        }
    }
};

export default processImageToHTMLSystem;