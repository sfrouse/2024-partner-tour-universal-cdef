import config from '../config.mjs';

const designSystemTemplate = (html) => {
    if (`${html}`?.indexOf(`<link rel="stylesheet" href`) === 0) {
        return `${html}`;
    }

    return `<link rel="stylesheet" href="${config.TOKENS_CSS}">
<script type="module" src="${config.WEB_COMPONENTS}"></script>

${html}`;
}

export default designSystemTemplate;