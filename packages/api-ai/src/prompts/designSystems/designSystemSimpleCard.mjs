import renderFollowUpResults from "../utils/renderFollowUpResults.mjs";
import designSystemTemplate from "../../templates/designSystemTemplate.mjs";
import designSystemComponentsSystem from "../../systems/systems/designSystem/designSystemComponentsSystem.mjs";
import config from "../../config.mjs";

const designSystemSimpleCard = {
    name: 'Simple Card with Design System',
    id: 'designSystemSimpleCard',
    prompts: async () => {
      return [
          {
            model: config.OPEN_AI_MODEL,
            messages: [
                await designSystemComponentsSystem.prompt(),
                {
                    "role": "user",
                    "content": `Create a simple card component.`,
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
        designSystemTemplate(action.results[0])
      );
    }
};

export default designSystemSimpleCard;