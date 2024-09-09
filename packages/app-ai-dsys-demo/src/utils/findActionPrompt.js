

export default function findActionPrompt(action) {
    if (action && action.prompt && action.prompt.messages) {
        const userMessage = action.prompt.messages.find(msg => msg.role === 'user');
        if (userMessage) {
            return userMessage.content;
        }
    }

    return 'no prompt found';
}