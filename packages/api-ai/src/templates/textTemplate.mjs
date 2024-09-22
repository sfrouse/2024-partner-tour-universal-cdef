


const textTemplate = (text) => {
    return `
        <style>
            body {
                font-size: 18px;
                line-height: 130%;
                color: #555;
                font-family: sans-serif;
                padding: 20px;
            }
            pre {
                white-space: pre-wrap; /* Preserves whitespace but allows wrapping */
                word-wrap: break-word; /* Breaks long words onto the next line */
                overflow-wrap: break-word; /* Ensures long words will break */
            }
        </style>

        <pre>${text}</pre>`;
}

export default textTemplate;