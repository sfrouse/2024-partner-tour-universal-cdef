import StyleDictionary from "style-dictionary";

StyleDictionary.registerTransform({
  name: 'breakpoint',
  type: 'value',
  transitive: true,
  matcher: (prop) => {
    return prop.path.includes('breakpoint');
  },
  transformer: (prop) => {
    return `${prop.original.value}px`;
  }
})