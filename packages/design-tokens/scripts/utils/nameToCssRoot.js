

export function nameToCSSRoot(name, prefix) {
    const cssName = name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    return `${prefix ? `${prefix}-` : ''}${cssName}`;
}