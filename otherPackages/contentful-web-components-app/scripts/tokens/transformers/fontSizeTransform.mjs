import StyleDictionary from "style-dictionary";

StyleDictionary.registerTransform({
  name: 'font-size',
  type: 'value',
  transitive: true,
  matcher: (prop) => {
    return prop.path.includes('fontSize') || prop.path.includes('lineHeight');
  },
  transformer: (prop) => {
    // token exporter is adding dimension px
    return prop.original.value.replace(/px/, 'rem');
  }
})