

export default function formatNumber(num) {
    if (!num) return -1;

    return Math.floor(num).toLocaleString('en-US');
}