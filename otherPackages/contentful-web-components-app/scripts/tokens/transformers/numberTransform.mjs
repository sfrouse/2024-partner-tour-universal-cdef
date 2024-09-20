import StyleDictionary from "style-dictionary";

StyleDictionary.registerTransform({
  name: 'number-transform',
  type: 'value',
  transitive: true,
  matcher: (prop) => {
    return prop.path.includes('zIndex') || (
      prop.path.includes('type') &&
      prop.path.includes('weight')
    );
  },
  transformer: (prop) => {
    // token exporter is adding dimension px
    return prop.original.value.replace(/px/, '');
  }
})