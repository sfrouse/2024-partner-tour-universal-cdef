

export default function pithyDateTime(dateTime) {
    const now = new Date(dateTime);
    const pithyDateTimeString = now.toLocaleString('en-US', {
        month: 'short', // e.g., "Sep"
        day: 'numeric', // e.g., "19"
        hour: 'numeric', // e.g., "10"
        minute: '2-digit', // e.g., "30"
        hour12: false // 24-hour format without AM/PM
    });

    return pithyDateTimeString;
}