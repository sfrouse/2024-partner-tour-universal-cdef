import StyleDictionary from 'style-dictionary-utils'
import { distPath, PREFIX } from '../config.mjs';
import '../transformers/valueCssProperty.mjs';
import '../transformers/valueCssPropertyName.mjs';
import '../transformers/breakpointTransform.mjs';
import '../transformers/numberTransform.mjs';
import '../transformers/fontSizeTransform.mjs';

const distFolder = `${distPath}`;

export default function getStyleDictionary(
  source, cssSelector
) {
  const ExtendedStyleDictionary = StyleDictionary.extend({
    source,
    include: [
      // `${srcPath}/*.tokens.json`
    ],
    platforms: {
      css: {
        transformGroup: 'css',
        transforms: [
          'attribute/cti',
          'number-transform',
          'breakpoint',
          'font-size',
          'name/cti/kebab',
          'color/rgb',
          'size/dimension'
        ],
        prefix: PREFIX,
        buildPath: `${distFolder}/css/`,
        files: [{
          destination: 'variables.css',
          format: 'css/variables',
          options: {
            outputReferences: true,
            selector: cssSelector,
          },
          filter: (token) =>
            (token.attributes.category === 'component') ? false : true
        }]
      },
      scss: {
        transformGroup: 'scss',
        transforms: [
          'attribute/cti',
          'name/cti/kebab',
          'value/css-property'
        ],
        prefix: PREFIX,
        buildPath: `${distFolder}/scss/`,
        files: [{
          destination: '_variables.scss',
          format: 'scss/variables',
          options: {
            outputReferences: true,
          }
        }]
      },
      typescript: {
        transforms: [
          'attribute/cti',
          'name/cti/kebab',
          'value/css-property',
        ],
        prefix: PREFIX,
        buildPath: `${distFolder}/typescript/`,
        files: [
          {
            destination: 'tokens.ts',
            format: 'javascript/esm',
            options: {
              outputReferences: true,
            },
          }
        ]
      },
      typescriptName: {
        transforms: [
          'attribute/cti',
          'name/cti/kebab',
          'value/css-property-name'
        ],
        prefix: PREFIX,
        buildPath: `${distFolder}/typescript/`,
        files: [
          {
            destination: 'token-names.ts',
            format: 'javascript/esm',
            options: {
              outputReferences: true,
            },
          }
        ]
      },
      // javascript: {
      //   transforms: [
      //     'attribute/cti',
      //     'name/cti/kebab',
      //     'value/css-property'
      //   ],
      //   prefix: PREFIX,
      //   buildPath: `${distFolder}/javascript/`,
      //   files: [{
      //     destination: 'tokens.js',
      //     format: 'javascript/esm',
      //     options: {
      //       outputReferences: true,
      //     }
      //   }]
      // },
      // javascriptNames: {
      //   transforms: [
      //     'attribute/cti',
      //     'name/cti/kebab',
      //     'value/css-property-name'
      //   ],
      //   prefix: PREFIX,
      //   buildPath: `${distFolder}/javascript/`,
      //   files: [{
      //     destination: 'token-names.js',
      //     format: 'javascript/esm',
      //     options: {
      //       outputReferences: true,
      //     }
      //   }]
      // },
      // json: {
      //   transformGroup: 'js',
      //   prefix: PREFIX,
      //   buildPath: `${distFolder}/figma/`,
      //   files: [
      //     {
      //       destination: 'variables.json',
      //       format: 'figmaTokensPlugin',
      //       options: {
      //         outputReferences: true,
      //       }
      //     },
      //   ],
      // },
    }
  });
  
  return ExtendedStyleDictionary;
}
