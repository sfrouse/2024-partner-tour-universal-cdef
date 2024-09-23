import { AI_SERVICE_URL } from "../Page";

const updateCode = async(
    actionId,
    newCode,
    setError,
    setLoading
) => {
    setLoading(true);

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const apiUrl = `${AI_SERVICE_URL}/action-code-update/${actionId}`;
    await fetch(
        apiUrl,
        {
            method: "POST",
            body: JSON.stringify({code: newCode}),
            headers: myHeaders,
            redirect: "follow"
        })
        .then(async (response) => {
            if (!response.ok) {
                throw new Error(JSON.stringify(await response.json(), null, 2));
            }
            return response.json();
        })
        .then(() => {
            setLoading(false);
        })
        .catch((error) => {
            setError(`run action: ${error}`);
            setLoading(false);
        });
}

export default updateCode;