import { AI_SERVICE_URL } from "../Page";



export default async function countTokens(prompt) {
    const apiUrl = `${AI_SERVICE_URL}/token-count`;
    const tokenCount = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({prompt}),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        // .then((result) => {
        //     console.log('result', result);
        // })
        .catch((error) => {
            // nothing...
            return 0;
        });

    return tokenCount.tokens;
}