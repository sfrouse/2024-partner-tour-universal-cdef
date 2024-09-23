

export default function findAllPrompts(action) {
    const prompts = [];
    if (
        action &&
        action.prompts
    ) {
        action.prompts.map(prompt => {
            if (prompt.type === 'claude') {
                return false;
            }

            prompt.messages.map((msg) => {
                prompts.push(msg.content);
                return false;
            });
            return false;
        });

        return prompts.join(' ');
    }

    return '';
}