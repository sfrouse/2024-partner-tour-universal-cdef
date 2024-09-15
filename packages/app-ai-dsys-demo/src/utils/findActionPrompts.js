

export default function findActionPrompts(action) {
    const prompts = [];
    if (
        action &&
        action.prompts
    ) {
        action.prompts.map(prompt => {
            if (prompt.type === 'message') {
                prompts.push(prompt.message);
                return false;
            }
            const userMessage = prompt.messages.find(msg => msg.role === 'user');
            if (userMessage) {
                if (Array.isArray(userMessage.content)) {
                    userMessage.content.map(content => {
                        if (content.type === 'LAST_UPLOADED_IMAGE') {
                            prompts.push("(upload last image)");
                        }else if (content.type === 'text') {
                            prompts.push(cleanString(content.text));
                        }
                        return true;
                    })
                }else{
                    prompts.push(cleanString(userMessage.content));
                }
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
            return <div className="prompt-code" key={index}>{part}</div>;
        }
    });

    return updatedText;
}