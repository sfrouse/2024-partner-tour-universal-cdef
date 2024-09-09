import textSystem from "../../systems/textSystem.mjs";
// import textTemplate from "../utils/textTemplate.mjs";

export default {
    name: 'Test',
    id: 'test',
    prompt: async () => {
        return {
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
        }
    }
};