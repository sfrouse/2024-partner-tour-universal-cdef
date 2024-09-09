import textSystem from "../../systems/textSystem.mjs";
// import textTemplate from "../utils/textTemplate.mjs";

export default {
    name: 'Web Comp',
    id: 'webComp',
    prompt: async () => {
        return {
            model: "gpt-4o",
            messages: [
            textSystem,
            {
                "role": "user",
                "content": `Create a web component of a button.`,
            }
            ],
            temperature: 0.1,
            max_tokens: 1000,
            top_p: 1,
        }
    }
};