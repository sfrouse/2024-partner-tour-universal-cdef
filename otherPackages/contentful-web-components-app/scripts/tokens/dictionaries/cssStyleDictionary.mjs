import StyleDictionary from 'style-dictionary-utils'
import { distPath, PREFIX } from '../config.mjs';
import '../transformers/valueCssProperty.mjs';
import '../transformers/valueCssPropertyName.mjs';
import '../transformers/fontSizeTransform.mjs';
import '../transformers/breakpointTransform.mjs';

const distFolder = `${distPath}`;

export default function getStyleDictionary(
  source, include, name
) {
  const ExtendedStyleDictionary = StyleDictionary.extend({
    source,
    include,
    platforms: {
      css: {
        transformGroup: 'css',
        transforms: [
          'attribute/cti',
          'name/cti/kebab',
          'breakpoint',
          'font-size',
          'size/px',
          'color/rgb',
          'size/dimension'
        ],
        prefix: PREFIX,
        buildPath: `${distFolder}/css/`,
        files: [{
          destination: `variables${name ? `-${name}` : ''}.css`,
          format: 'css/variables',
          options: {
            outputReferences: true,
            selector: name ? `.${PREFIX}-${name}` : '' || ':root'
          },
          filter: (token) =>
            (token.attributes.category === 'component') ? false : true
        }]
      }
    }
  });
  
  return ExtendedStyleDictionary;
}
