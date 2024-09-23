import config from "../../config.mjs";
import textSystem from "../../systems/systems/textSystem.mjs";
import textTemplate from "../../templates/textTemplate.mjs";
import renderFollowUpResults from "../utils/renderFollowUpResults.mjs";

export default {
    name: 'Open Ended',
    isOpen: true,
    id: 'openEnded',
    prompts: async () => {
        return [
            {
                model: config.OPEN_AI_MODEL,
                messages: [
                    await textSystem.prompt(),
                    {
                        "role": "user",
                        "content": ``,
                    }
                ],
                temperature: config.OPEN_AI_TEMPERATURE,
                max_tokens: config.OPEN_AI_MAX_TOKENS,
                top_p: config.OPEN_AI_TOP_P,
            },
        ]
    },
    render: async (action) => {
        return renderFollowUpResults(
            action,
            textTemplate(action.results ? action.results.join('<br/><br/>') : '')
        );
    }
};