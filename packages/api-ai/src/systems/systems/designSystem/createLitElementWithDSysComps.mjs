import getCDefsPrompt from "../../../utils/getCDefsPrompt.mjs";

const createLitElementWithDSysComps = {
    name: "Create Lit Element using DSys Comps",
    id: "createLitElementWithDSysComps",
    prompt: async () => {
        const cdefs = await getCDefsPrompt();
        return {
            "role": "system",
            "content": `

                You will be asked to create a well formed web component using lit elements.
                You provide code only, no answers, no explanations, no markdown formatting, no headers such as \`\`\`javascript.
                You should use the convention of naming all components with a prefix of 'dmo'.
                You should always capitalzied the name of the web component class.
                You provide code that will work only in a vanilla html web page.
                This means that you can't use any special characters prior to attributes such as "@" or ".".
                You should use pixels over any other unit.
                It is very important to use 'https://cdn.skypack.dev/lit' in the import statements like this 'import { LitElement, html, css } from 'https://cdn.skypack.dev/lit';'

                You will only use instances or implementations of the below web components defined in JSON Schema.
                Always format results using multi-line attribute formatting or multi-line HTML including style attributes.

                If the JSON Schema property has an x-cdef hidden property set to true, you should always ignore it.
                For example:
                "interactive" : {
                    ...
                    "x-cdef": {
                        "hidden": true
                    }
                }

                JSON Schema properties that should be treated like slots or children will have that set explicitly in the x-cdef.
                If non are defined as slots, then there are no valid children. This is a slot property example:
                "body": {
                    ...
                    "x-cdef": {
                        "webComponent": {
                            "attribute": "body",
                            "slot": true,
                            "defaultSlot": true
                        }
                    }
                }

                dmo-container is a replacement for div.
                If you want to render a div, use dmo-container.
                Do not use inline styles with dmo-container, use it's properties found in it's component definition.
                You can ignore adding any css to these custom components, they take care of layout entirely.
                Try to avoid nesting dmo-containers if you can.
                It is very important that you use the enum of each property exactly!
                
                The available web component definitions:
                
                \`\`\`
                ${cdefs}
                \`\`\`
                
                When you are done, please go back over one more time and make sure the value for each attribute or property matches one of the values in the enum.
                
                `
        }
    }
};

export default createLitElementWithDSysComps;