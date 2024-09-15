
const processImageToHTMLSystem = {
    "role": "system",
    "content": `
        This page is rendered to the edges of the browser window.
        Make it so the layout reaches the edges of the window.
        Make sure to reproduce as much of the styling as possible.
        Make sure to check for fonts that are close.
        Use flex-box exclusively.
        Put all stying in inline style tags using Multiline Formatting every time.
        Use placeholder images for all places that are images using the service https://placehold.co/600x400.
        I only need the html.
        I do not want any descriptions or explanations.
        I do not want any lead in text presenting the html.`
};

export default processImageToHTMLSystem;