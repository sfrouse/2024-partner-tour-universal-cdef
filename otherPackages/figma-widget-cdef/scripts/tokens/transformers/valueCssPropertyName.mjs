import StyleDictionary from 'style-dictionary-utils'

StyleDictionary.registerTransform({
  name: 'value/css-property-name',
  type: 'value',
  transitive: true,
  transformer: function(prop) {
    return prop.name;
  }
});