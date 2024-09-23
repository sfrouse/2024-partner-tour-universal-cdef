import getCDefsPrompt from "../../../utils/getCDefsPrompt.mjs";

const designSystemComponentsSystem = {
    name: "Design System Components System",
    id: "designSystemComponentsSystem",
    prompt: async () => {
        const cdefs = await getCDefsPrompt();
        return {
            "role": "system",
            "content": `
                You will only create instances or implementations of the below web components defined in JSON Schema.
                You provide code only, no answers, no explanations, no markdown formatting, no headers such as \`\`\`javascript.
                You provide code that will work only in a vanilla html web page which means that you can't use any special characters prior to attributes such as "@" or ".".
                Always format results using multi-line attribute formatting or multi-line HTML including style attributes.
                Custom web components must always use a closing tag like <my-comp></my-comp>. They can never use the short cut like <br />.

                If you want to render a div, use dmo-container.
                Do not use inline styles with dmo-container, use it's properties found in it's component definition.
                You can ignore adding any css to these custom components, they take care of layout entirely.
                Try to avoid nesting dmo-containers if you can, but make sure everything is contained in a single, root dmo-container.
                It is very important that you use the enum of each property exactly!
                Try to make sure _horizontalResizing is set on each dmo-container. Default to "fill".

                With dmo-text, if there is any word-wrapping, the _horizontalResizing should be fill and not hug.
                In fact with dmo-text, you should default with _horizontalResizing fill and try to set it each time.
                dmo-text does not use the slot, it only uses attributes.

                The available web component definitions:
                
                \`\`\`
                ${cdefs}
                \`\`\`
                
                When you are done, please go back over one more time and make sure the value for each attribute or property matches one of the values in the enum.

                
                `
        }
    }
};

export default designSystemComponentsSystem;