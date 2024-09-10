import textSystem from "../../systems/textSystem.mjs";

export default {
    name: 'Test',
    id: 'test',
    prompts: async () => {
        return [
            {
                model: "gpt-4o",
                messages: [
                    textSystem,
                    {
                        "role": "user",
                        "content": `What is the solution to war?`,
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
                        "content": `What is a dog?`,
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
        return action.results.join('\n\n');
    }
};