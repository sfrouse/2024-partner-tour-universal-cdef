import { AI_SERVICE_URL } from "../Page";

const runAI = async(
    actionToRun,
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

    const apiUrl = `${AI_SERVICE_URL}/ai/${actionToRun}`;
    fetch(apiUrl)
        .then((response) => {
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((action) => {
            setAction(action);

            // ---- FINISH ------------
            setIsRunning(false);
            setDurationEnd(Date.now());
            // ------------------------
        })
        .catch((error) => {
            setError(`run action: ${error.message}`);
            setLoading(false);
        });
}

export default runAI;