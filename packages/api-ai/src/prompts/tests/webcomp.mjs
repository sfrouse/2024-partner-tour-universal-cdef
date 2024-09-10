import webCompInstanceSystem from "../../systems/webCompInstanceSystem.mjs";
import webCompSystem from "../../systems/webCompSystem.mjs";
// import textTemplate from "../utils/textTemplate.mjs";

export default {
    name: 'Web Comp',
    id: 'webComp',
    prompts: async () => {
        return [
            {
                model: "gpt-4o",
                messages: [
                    webCompSystem,
                    {
                        "role": "user",
                        "content": `Create a web component of a button.`,
                    }
                ],
                temperature: 0.1,
                max_tokens: 1000,
                top_p: 1,
            },
            {
                model: "gpt-4o",
                messages: [
                    webCompInstanceSystem,
                    {
                        "role": "user",
                        "content": `
                            Create an instance of this web component
                            attaching a click action that alerts a "hello, world" message.`,
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

        return `<!-- WEB COMPONENT CODE -->
<script type="module">
    ${action.results[0]}
</script>

<!-- INSTANCE -->
${action.results[1]}`;

    }
};