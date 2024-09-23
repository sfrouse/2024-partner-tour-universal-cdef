import webCompInstanceSystem from "../../systems/systems/webComps/webCompInstanceSystem.mjs";
import dmoButtonCDef from '@contentful-demos/web-components/dist/cdef/dmo-button.cdef.json' assert { type: 'json' }
import renderAsText from "../utils/renderAsText.mjs";
import designSystemTemplate from "../../templates/designSystemTemplate.mjs";
import renderFollowUpResults from "../utils/renderFollowUpResults.mjs";
import config from "../../config.mjs";

export default {
    name: 'Web Comp using CDef',
    id: 'webCompCDef',
    prompts: async () => {
        return [
            {
                model: config.OPEN_AI_MODEL,
                messages: [
                    await webCompInstanceSystem.prompt(),
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
                temperature: config.OPEN_AI_TEMPERATURE,
                max_tokens: config.OPEN_AI_MAX_TOKENS,
                top_p: config.OPEN_AI_TOP_P,
            }
        ]
    },
    render: async (action) => {
        return renderFollowUpResults(
            action,
            designSystemTemplate(`
                <!-- INSTANCE -->
                ${action.results[0]}
                
                ${renderAsText(action.results[0])}`)
        );
    }
};
