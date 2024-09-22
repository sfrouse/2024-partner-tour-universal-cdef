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
        model: "gpt-4o",
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
        temperature: 0,
        max_tokens: 1000,
        top_p: 1,
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    const apiUrl = `${AI_SERVICE_URL}/ai/convo/${actionId}`;
    const result = await fetch(apiUrl, requestOptions)
        .then((response) => response.json())
        .catch((error) => {
            setError(`run action: ${error.message}`);
            setLoading(false);
        });

    setAction(result);

    // ---- FINISH ------------
    setIsRunning(false);
    setDurationEnd(Date.now());
    // ------------------------
    return result;
}

export default runAIConvo;