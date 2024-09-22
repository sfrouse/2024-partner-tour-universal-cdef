import textSystem from "../../systems/systems/textSystem.mjs";
import textTemplate from "../../templates/textTemplate.mjs";
import renderFollowUpResults from "../utils/renderFollowUpResults.mjs";

export default {
    name: 'Test',
    id: 'test',
    prompts: async () => {
        return [
            {
                model: "gpt-4o",
                messages: [
                    await textSystem.prompt(),
                    {
                        "role": "user",
                        "content": `What is a dog?`,
                    }
                ],
                temperature: 0,
                max_tokens: 1000,
                top_p: 1,
            },
        ]
    },
    render: async (action) => {
        return renderFollowUpResults(
            action,
            textTemplate(action.results.join('<br/><br/>'))
        );
    }
};