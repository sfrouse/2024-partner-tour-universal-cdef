import reactSystem from "../systems/reactSystem.mjs";

async function action() {
    return {
        name: 'createButtonWithHex',
        prompt:{
            model: "gpt-4o",
            messages: [
                reactSystem,
                {
                    "role": "user",
                    "content": `Create a react component that is a button with rounded corners using a primary color of #f00.
                    
Use a style tag for css and provide all the various interactive states and use "Button" as a default label.`,
                }
            ],
            temperature: 0.1,
            max_tokens: 1000,
            top_p: 1,
        },
        render: async () => {
            const renderFunk = await import('../generatedCode/createButtonWithHex-compiled.mjs');
            return renderFunk.default;
        }
    };
}

export default action;