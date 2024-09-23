import { AI_SERVICE_URL } from "../Page";

export default async function getLatestUsage(
    setLatestUsage
) {
    const apiUrl = `${AI_SERVICE_URL}/latest-usage`;
    fetch(apiUrl)
        .then((response) => {
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((usage) => {
            setLatestUsage(usage);
        })
        .catch((error) => {
            
        });
}