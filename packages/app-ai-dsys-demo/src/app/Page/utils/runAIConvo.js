import config from "@partner-tour-2024/api-ai/src/config.mjs";
import { AI_SERVICE_URL } from "../Page";

const runAIConvo = async(
    actionId,
    prompt,

    setDurationStart,
    setDurationEnd,
    setCurrentDuration,
    setIsRunning,
    setAction,
    setError,
    setLoading
) => {
    // ---- SETUP ------------
    setDurationStart(Date.now());
    setDurationEnd(null);
    setCurrentDuration(0);
    setIsRunning(true);
    // ------------------------

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        model: config.OPEN_AI_MODEL,
        messages: [
            {
                "role": "system",
                "content": "placeholder"
            },
            {
                "role": "user",
                "content": prompt,
            }
        ],
        temperature: config.OPEN_AI_TEMPERATURE,
        max_tokens: config.OPEN_AI_MAX_TOKENS,
        top_p: config.OPEN_AI_TOP_P,
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    const apiUrl = `${AI_SERVICE_URL}/ai-convo/${actionId}`;
    const result = await fetch(apiUrl, requestOptions)
        .then(async (response) => {
            if (!response.ok) {
                throw new Error(JSON.stringify(await response.json(), null, 2));
            }
            return response.json();
        })
        .catch((error) => {
            setError(`run action: ${error}`);
            setLoading(false);
            setIsRunning(false);
        });

    setAction(result);

    // ---- FINISH ------------
    setIsRunning(false);
    setDurationEnd(Date.now());
    // ------------------------
    return result;
}

export default runAIConvo;