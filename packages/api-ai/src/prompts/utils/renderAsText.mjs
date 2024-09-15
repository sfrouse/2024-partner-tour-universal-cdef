export default function renderAsText(text) {
    return `<pre style="white-space: pre-wrap;word-wrap: break-word;">${
        text ? text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;") : ''
    }</pre>`;
}``