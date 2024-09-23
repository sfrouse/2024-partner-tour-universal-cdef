import { AI_SERVICE_URL } from "../Page";



export default function resetAll(
    setLoading,
    setIsRunning,
    setError,
    setInvalidate
) {
    setLoading(true);
    setIsRunning(true);
    const resetAllUrl = `${AI_SERVICE_URL}/reset`;
    fetch(resetAllUrl)
        .then(async (response) => {
            if (!response.ok) {
            throw new Error(JSON.stringify(await response.json(), null, 2));
            }
            return response.json();
        })
        .then(() => {
            setLoading(false);
            setIsRunning(false);
            setInvalidate(Date.now());
        })
        .catch((error) => {
            setIsRunning(false);
            setError(`load actions: ${error}`);
            setLoading(false);
            setInvalidate(Date.now());
        });
}