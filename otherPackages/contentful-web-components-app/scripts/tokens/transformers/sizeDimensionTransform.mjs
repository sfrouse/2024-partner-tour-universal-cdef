import StyleDictionary from "style-dictionary";

StyleDictionary.registerTransform({
  name: 'size/dimension',
  type: 'value',
  transitive: true,
  matcher: (prop) => {
    return prop.path.includes('size') &&
      prop['$type'] === 'dimension';
  },
  transformer: (prop) => {
    if (`${prop.original.value}`.indexOf('{') === 0) {
      return prop.value;
    }
    return `${prop.value}px`;
  }
})