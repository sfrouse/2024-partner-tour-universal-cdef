
const textSystem = {
    name: "Text System",
    id: "text",
    prompt: async () => {
        return {
            "role": "system",
            "content": `You are just answering people's questions for a demo.
                Keep explanations to a paragraph or two.`
        }
    }
};

export default textSystem;