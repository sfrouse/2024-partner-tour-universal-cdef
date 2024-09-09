export default function textTemplate(content) {
    return `
const result = () => {
  return (<div style={{whiteSpace: 'pre-wrap'}}>${content
      .replace(/`/g, '\\`')
      .replace(/{/g, '&#123;')
      .replace(/}/g, '&#125;')
      .replace(/:/g, '&#58;')
      .replace(/\n/g, '<br/>')
      .replace(/\t/g, '&nbsp;&nbsp;')
    }</div>);
}
export default result;`;
}