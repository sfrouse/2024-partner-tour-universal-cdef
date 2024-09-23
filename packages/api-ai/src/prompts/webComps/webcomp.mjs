import config from "../../config.mjs";
import webCompInstanceSystem from "../../systems/systems/webComps/webCompInstanceSystem.mjs";
import webCompSystem from "../../systems/systems/webComps/webCompSystem.mjs";
import renderFollowUpResults from "../utils/renderFollowUpResults.mjs";
// import textTemplate from "../utils/textTemplate.mjs";

export default {
    name: 'Web Comp',
    id: 'webComp',
    prompts: async () => {
        return [
            {
                model: config.OPEN_AI_MODEL,
                messages: [
                    await webCompSystem.prompt(),
                    {
                        "role": "user",
                        "content": `Create a web component of a button.`,
                    }
                ],
                temperature: config.OPEN_AI_TEMPERATURE,
                max_tokens: config.OPEN_AI_MAX_TOKENS,
                top_p: config.OPEN_AI_TOP_P,
            },
            {
                model: config.OPEN_AI_MODEL,
                messages: [
                    await webCompInstanceSystem.prompt(),
                    {
                        "role": "user",
                        "content": `
                            Create an instance of this web component
                            attaching a click action that alerts a "hello, world" message.`,
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
            `<!-- WEB COMPONENT CODE -->
<script type="module">
    ${action.results[0]}
</script>

<!-- INSTANCE -->
${action.results[1]}
`
        );
    }
};