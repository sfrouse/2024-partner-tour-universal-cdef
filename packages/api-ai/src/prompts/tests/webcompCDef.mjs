import webCompInstanceSystem from "../../systems/webCompInstanceSystem.mjs";
import dmoButtonCDef from '@contentful-demos/web-components/dist/cdef/dmo-button.cdef.json' assert { type: 'json' }
import config from '../../config.mjs';
import textSystem from "../../systems/textSystem.mjs";

export default {
    name: 'Web Comp using CDef',
    id: 'webCompCDef',
    prompts: async () => {
        console.log('dmoButtonCDef', dmoButtonCDef);
        return [
            {
                model: "gpt-4o",
                messages: [
                    webCompInstanceSystem,
                    {
                        "role": "user",
                        "content": `
                            Create an instance of the web component that is defined below.
                            Try to use all the properties, but don't disable it.
                            Attach a click action that alerts a "hello, world" message.
                            
                            The web component definition in JSON Schema to use:
                            \`\`\`
                            ${JSON.stringify(dmoButtonCDef, null, 2)}
                            \`\`\``,
                    }
                ],
                temperature: 0.1,
                max_tokens: 1000,
                top_p: 1,
            },
            {
                model: "gpt-4o",
                messages: [
                    textSystem,
                    {
                        "role": "user",
                        "content": `
                            Looking at your previous web component instance and comparing to the component definition in the earlier request,
                            do you think that is right? Would you change anything?`,
                    }
                ],
                temperature: 0.1,
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
<!-- INSTANCE -->
${action.results[0]}


${renderText(action.results[1])}

${renderText(action.results[0])}`;


    }
};

function renderText(text) {
    return `<pre style="white-space: pre-wrap;word-wrap: break-word;">${
        text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;")
    }</pre>`;
}