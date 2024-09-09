

export default function applyClassDecoratorValues(
    decoratorResults, compDefinition
) {

    if (!decoratorResults) return;

    decoratorResults.hiddenProperties?.map(hiddenProp => {
        compDefinition.properties[hiddenProp] = {
            $schema: "https://json-schema.org/draft-07/schema",
            title: hiddenProp,
            type: "string",
            "x-cdef": {
              input: {
                inputType: "string",
                label: hiddenProp
              },
              output: {
                webComponent: {
                  attribute: hiddenProp
                }
              },
              hidden: true
            }
        }
    });

    decoratorResults.designProperties?.map(designProp => {
      if (
        // !designProp.options ||
        !designProp.property
      ) {
        console.log("designProp malformed", designProp);
        return;
      }
      let prop = {
        label: "Unknown",
        inputType: 'string',
        cssProperty: 'Unknown',
        figmaProperty: 'Unknown',
      }
      if (designProp.property === '_backgroundColor') {
        prop = {
          label: "Background Color",
          inputType: 'color',
          cssProperty: 'background-color',
          figmaProperty: 'backgroundColor',
        }
      }
      if (designProp.property === '_textColor') {
        prop = {
          label: "Text Color",
          inputType: 'color',
          cssProperty: 'color',
          figmaProperty: 'textColor',
        }
      }
      if (designProp.property === '_cornerRadius') {
        prop = {
          label: "Corner Radius",
          inputType: 'number',
          cssProperty: 'border-radius',
          figmaProperty: 'cornerRadius',
        }
      }
      if (designProp.property === '_padding') {
        prop = {
          label: "Padding",
          inputType: 'string', // allows for array overloading
          cssProperty: 'padding',
          figmaProperty: 'padding',
        }
      }

      // LAYOUT
      if (designProp.property === '_gap') {
        prop = {
          label: "Gap",
          inputType: 'string', // allows for array overloading
          cssProperty: 'gap',
          figmaProperty: 'gap',
        }
      }
      if (designProp.property === '_layoutDirection') {
        prop = {
          label: "Layout Direction",
          inputType: 'string',
          cssProperty: 'flex-direction',
          figmaProperty: 'autoLayoutDirection',
        }
      }
      if (designProp.property === '_verticalResizing') {
        prop = {
          label: "Vertical Resizing",
          inputType: 'string',
          cssProperty: '--vertical-resizing',
          figmaProperty: 'layoutSizingVertical',
        }
      }
      if (designProp.property === '_horizontalResizing') {
        prop = {
          label: "Horizontal Resizing",
          inputType: 'string',
          cssProperty: '--horizontal-resizing',
          figmaProperty: 'layoutSizingHorizontal',
        }
      }
      if (designProp.property === '_width') {
        prop = {
          label: "Width",
          inputType: 'string',
          cssProperty: 'width',
          figmaProperty: 'width',
        }
      }
      if (designProp.property === '_height') {
        prop = {
          label: "Height",
          inputType: 'string',
          cssProperty: 'height',
          figmaProperty: 'height',
        }
      }
      if (designProp.property === '_verticalFlexGrow') {
        prop = {
          label: "Vertical Flex",
          inputType: 'string',
          cssProperty: '--vertical-flex-grow',
          figmaProperty: 'verticalFlexGrow',
        }
      }
      if (designProp.property === '_horizontalFlexGrow') {
        prop = {
          label: "Horizontal Flex",
          inputType: 'string',
          cssProperty: '--horizontal-flex-grow',
          figmaProperty: 'horizontalFlexGrow',
        }
      }
      // if (designProp.property === '_flexGrow') {
      //   prop = {
      //     label: "Flex Grow",
      //     inputType: 'string',
      //     cssProperty: 'flex-grow',
      //     figmaProperty: 'autoLayoutFlexGrow',
      //   }
      // }
      // if (designProp.property === '_flexShrink') {
      //   prop = {
      //     label: "Flex Shrink",
      //     inputType: 'string',
      //     cssProperty: 'flex-shrink',
      //     figmaProperty: 'autoLayoutFlexShrink',
      //   }
      // }
      // if (designProp.property === '_flexBasis') {
      //   prop = {
      //     label: "Flex Basis",
      //     inputType: 'string',
      //     cssProperty: 'flex-basis',
      //     figmaProperty: 'autoLayoutFlexBasis',
      //   }
      // }

      // BORDER
      if (designProp.property === '_border') {
        prop = {
          label: "Border",
          inputType: 'string',
          cssProperty: 'border',
          figmaProperty: 'style:border',
        }
      }
      if (designProp.property === '_borderColor') {
        prop = {
          label: "Border Color",
          inputType: 'color',
          cssProperty: 'border-color',
          figmaProperty: 'borderColor',
        }
      }
      if (designProp.property === '_borderWidth') {
        prop = {
          label: "Border Width",
          inputType: 'number',
          cssProperty: 'border-width',
          figmaProperty: 'borderWidth',
        }
      }
      if (designProp.property === '_borderStyle') {
        prop = {
          label: "Border Style",
          inputType: 'string',
          cssProperty: 'border-style',
          figmaProperty: 'borderStyle',
        }
      }
      if (designProp.property === '_fontFamily') {
        prop = {
          label: "Font Family",
          inputType: 'string',
          cssProperty: 'font-family',
          figmaProperty: 'fontFamily',
        }
      }
      if (designProp.property === '_fontWeight') {
        prop = {
          label: "Font Weight",
          inputType: 'string',
          cssProperty: 'font-weight',
          figmaProperty: 'fontWeight',
        }
      }

      // TYPOGRAPHY
      if (designProp.property === '_font') {
        prop = {
          label: "Font",
          inputType: 'string',
          cssProperty: 'font',
          figmaProperty: 'font',
        }
      }

      const propertyDef = {
          $schema: "https://json-schema.org/draft-07/schema",
          title: prop.label,
          type: 'string',
          "x-cdef": {
            design: true,
            input: {
              inputType: 'string',
              label: prop.label,
              defaultValue: designProp.default
            },
            output: {
              figma: {
                property: prop.figmaProperty,
              },
              webComponent: {
                cssProperty: prop.cssProperty,
              }
            }
          }
      }
      if (designProp.options) {
        propertyDef.enum = Object.values(designProp.options);
        propertyDef["x-cdef"].input.options = designProp.options;
        propertyDef["x-cdef"].input.inputType = 'select';
      }
      compDefinition.properties[designProp.property] = propertyDef;
    });

    decoratorResults.slots?.map(slot => {
        if (!slot.label || !slot.property) {
            console.log("Slot malformed", slot);
            return;
        }
        compDefinition.properties[slot.property] = {
            $schema: "https://json-schema.org/draft-07/schema",
            title: slot.label,
            type: "string",
            "x-cdef": {
              input: {
                inputType: "string",
                label: slot.label
              },
              output: {
                content: {
                  content: true,
                },
                webComponent: {
                  attribute: slot.property,
                  slot: true,
                  defaultSlot: slot.defaultSlot === true ? true : undefined
                }
              }
            }
        }
    });

    decoratorResults.examples?.map(example => {
        compDefinition['x-cdef'].examples = compDefinition['x-cdef'].examples || [];
        compDefinition['x-cdef'].examples.push(
            example
        )
    });

    if (decoratorResults.figmaComponent) {
        compDefinition['x-cdef'].figma = {
            component: decoratorResults.figmaComponent
        }
    }

    if (decoratorResults.name) {
      compDefinition['x-cdef'].name = decoratorResults.name;
    }

    if (decoratorResults.import) {
      compDefinition['x-cdef'].import = decoratorResults.import;
    }
}