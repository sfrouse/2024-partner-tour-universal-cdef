import StyleDictionary from 'style-dictionary-utils'

StyleDictionary.registerTransform({
  name: 'value/css-property',
  type: 'value',
  transitive: true,
  transformer: function(prop) {
    return `var( --${prop.name} )`;
  }
});