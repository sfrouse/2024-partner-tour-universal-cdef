


export default function tokensToTypeScriptReferences(
    tsTokens,
    prefix,
    name,
    fullName,
    typescript,
    // indent
) {
    const finalTypescript = typescript || {};
    // const finalIndent = indent === undefined ? 0 : indent + 1;
    if (typeof tsTokens === "string") {
        if (name) {
            const prefixStr = prefix ? `${prefix}-` : '';
            finalTypescript[name] = `var( --${prefixStr}${fullName} )`;
        }
    }else{
        if (name) {
            finalTypescript[name] = {};
        }
        Object.entries(tsTokens).map(entry => {
            const entryName = entry[0];
            const value = entry [1];
            // first one is the mode
            const finalFullName = `${fullName ? `${fullName}-` : ''}${entryName}`;
            tokensToTypeScriptReferences(
                value,
                prefix,
                entryName,
                finalFullName,
                finalTypescript[name] || finalTypescript
            );
        });
    }
    return finalTypescript;
}