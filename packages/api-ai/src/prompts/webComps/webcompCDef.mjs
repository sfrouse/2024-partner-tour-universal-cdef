import webCompInstanceSystem from "../../systems/webCompInstanceSystem.mjs";
import dmoButtonCDef from '@contentful-demos/web-components/dist/cdef/dmo-button.cdef.json' assert { type: 'json' }
import config from '../../config.mjs';
import renderAsText from "../utils/renderAsText.mjs";

export default {
    name: 'Web Comp using CDef',
    id: 'webCompCDef',
    prompts: async () => {
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
<!-- INSTANCE -->
${action.results[0]}

${renderAsText(action.results[0])}`;

    }
};
