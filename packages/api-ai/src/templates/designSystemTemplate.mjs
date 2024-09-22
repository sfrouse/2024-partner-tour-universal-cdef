import config from '../config.mjs';

const designSystemTemplate = (html) => {
    return `
<link rel="stylesheet" href="${config.TOKENS_CSS}">
<script type="module" src="${config.WEB_COMPONENTS}"></script>

            ${html}`;
}

export default designSystemTemplate;