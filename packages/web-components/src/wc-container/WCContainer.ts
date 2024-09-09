import { CDefDesignProperty, define, defineComponent } from '@contentful-demos/component-definitions/dist';
import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import styles from './WCContainer.scss';
import semantic from '../../dist/tokens/semantic';

@defineComponent(
    'WC Container', {
        examples: [
            {name: 'Simple', path: './examples/wc-container.cdef.inst.json'}
        ],
        slots: [
            {label: 'Body', property: 'body', defaultSlot: true}
        ],
        designProperties: [
            {
              property: CDefDesignProperty.BACKGROUND_COLOR,
              options: semantic.background
            },
            {
              property: CDefDesignProperty.TEXT_COLOR,
              options: semantic.text
            },
            // BORDER
            {
              property: CDefDesignProperty.BORDER_COLOR,
              options: semantic.border
            },
            {
              property: CDefDesignProperty.BORDER_WIDTH,
              options: semantic.border_width
            },
            {
              property: CDefDesignProperty.BORDER_STYLE,
              options: {
                'None': 'none',
                'Solid': 'solid',
                'Dashed': 'dashed'
              },
              default: 'none'
            },
            {
              property: CDefDesignProperty.CORNER_RADIUS,
              options: semantic.border_radius
            },

            // LAYOUT
            {
              property: CDefDesignProperty.PADDING,
              options: semantic.padding
            },
            {
              property: CDefDesignProperty.GAP,
              options: semantic.gap
            },
            {
              property: CDefDesignProperty.LAYOUT_DIRECTION,
              options: {
                'Horizontal': 'row',
                'Vertical': 'column',
                // 'Horizontal Reversed': 'row-reverse',
                // 'Vertical Reversed': 'column-reverse'
              },
            },
            {
              property: CDefDesignProperty.HORIZONTAL_RESIZING,
              options: {
                'Fixed': 'fixed',
                'Fill': 'fill',
                'Hug': 'hug'
              },
              default: 'hug'
            },
            {
              property: CDefDesignProperty.WIDTH,
            },
            {
              property: CDefDesignProperty.HORIZONTAL_FLEX_GROW,
              options: {
                '1': '1',
                '2': '2',
                '3': '3',
                '4': '4',
                '5': '5',
                '6': '6',
                '7': '7',
                '8': '8',
                '9': '9',
                '10': '10',
                '11': '11',
                '12': '12'
              }
            },
            {
              property: CDefDesignProperty.VERTICAL_RESIZING,
              options: {
                'Fixed': 'fixed',
                'Fill': 'fill',
                'Hug': 'hug'
              },
              default: 'hug'
            },
            {
              property: CDefDesignProperty.HEIGHT,
            },
            {
              property: CDefDesignProperty.VERTICAL_FLEX_GROW,
              options: {
                '1': '1',
                '2': '2',
                '3': '3',
                '4': '4',
                '5': '5',
                '6': '6',
                '7': '7',
                '8': '8',
                '9': '9',
                '10': '10',
                '11': '11',
                '12': '12'
              }
            },
            // {
            //   property: CDefDesignProperty.FLEX_GROW,
            //   options: {
            //     'Flex 1': '1',
            //     'Flex 2': '2',
            //     'Flex 3': '3',
            //     'Flex 4': '4',
            //     'Flex 5': '5',
            //     'Flex 6': '6',
            //     'Flex 7': '7',
            //     'Flex 8': '8',
            //     'Flex 9': '9',
            //     'Flex 10': '10',
            //     'Flex 11': '11',
            //     'Flex 12': '12'
            //   },
            // },

            // TYPOGRAPHY
            {
              property: CDefDesignProperty.FONT,
              options: semantic.type
            },
            {
              property: CDefDesignProperty.FONT_FAMILY,
              options: semantic.type_family
            },
            {
              property: CDefDesignProperty.FONT_WEIGHT,
              options: semantic.type_weight
            },
            
          ]
    }
)

@customElement('wc-container')
export class WCContainer extends LitElement {

    static styles = styles;

    constructor() {
        super();
    }

    @define('Text', {content: true})
    @property({reflect: true})
        text: string = 'default text';

    // createRenderRoot() {
    //     return this; // Render in light DOM
    // }
 
    render(): object {
        return html`
          <div>${this.text}</div>
          <slot></slot>
        `;
    }
}

declare global {
  interface HTMLElementTagNameMap {
    'wc-container': WCContainer;
  }
}