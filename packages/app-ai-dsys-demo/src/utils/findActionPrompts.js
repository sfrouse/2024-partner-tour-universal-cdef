

export default function findActionPrompts(action) {
    const prompts = [];
    if (
        action &&
        action.prompts
    ) {
        action.prompts.map(prompt => {
            const userMessage = prompt.messages.find(msg => msg.role === 'user');
            if (userMessage) {
                prompts.push(cleanString(userMessage.content));
            }
            return false;
        });
        return prompts;
    }

    return 'no prompt found';
}

function cleanString(input) {
    // Remove return characters (\r) and newlines (\n)
    // Replace multiple spaces with a single space
    let output = input.replace(/[\r\n]+/g, '').replace(/\s+/g, ' ').trim();
    
    const updatedText = output.split(/```(.*?)```/g).map((part, index) => {
        // If it's an even index, it's plain text, otherwise it's inside the backticks
        if (index % 2 === 0) {
            return part;
        } else {
            return <div style={{
                fontSize: 9,
                lineHeight: `130%`,
                color: '#888'
            }} key={index}>{part}</div>;
        }
    });

    return updatedText;
}