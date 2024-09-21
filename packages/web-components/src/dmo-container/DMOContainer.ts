import {
  CDefDesignProperty,
  define,
  defineComponent,
  layoutsToCss
} from '@contentful-demos/component-definitions/dist';
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import styles from './DMOContainer.scss';
import semantic from '../../dist/tokens/semantic';
import {
    getCSSDeclarations
} from 'src/utils/getCSSProp';

@defineComponent(
    'Demo Container', {
        examples: [
            {name: 'Simple', path: './examples/dmo-container.cdef.inst.json'}
        ],
        slots: [
            {label: 'Body', property: 'body', defaultSlot: true}
        ],
        designProperties: [
            {
              property: CDefDesignProperty.BACKGROUND_COLOR,
              options: semantic.background
            },
            // {
            //   property: CDefDesignProperty.TEXT_COLOR,
            //   options: semantic.text
            // },
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
              default: 'column'
            },
            {
              property: CDefDesignProperty.ALIGN_ITEMS,
              options: {
                'Start': 'start',
                'Center': 'center',
                'End': 'end',
                'Stretch': 'stretch'
              },
              default: 'start'
            },
            {
              property: CDefDesignProperty.JUSTIFY_CONTENT,
              options: {
                'Start': 'start',
                'Center': 'center',
                'End': 'end',
                'Space Between': 'space-between'
              },
              default: 'start'
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
            }
          ]
    }
)

@customElement('dmo-container')
export class DmoContainer extends LitElement {

    static styles = styles;

    constructor() {
        super();
    }

    @define('Internal Label', {content: true})
    @property({reflect: true})
      internalLabel: string;
  
    // createRenderRoot() {
    //     return this; // Render in light DOM
    // }
 
    render(): object {
        return html`
          <style>:host {
            ${getCSSDeclarations({
              "background-color": this.getAttribute(CDefDesignProperty.BACKGROUND_COLOR),
              "border-color": this.getAttribute(CDefDesignProperty.BORDER_COLOR),
              "border-width": [this.getAttribute(CDefDesignProperty.BORDER_WIDTH), '0'],
              "border-style": [this.getAttribute(CDefDesignProperty.BORDER_STYLE), 'solid'],
              "border-radius": this.getAttribute(CDefDesignProperty.CORNER_RADIUS),
              "padding": this.getAttribute(CDefDesignProperty.PADDING),
              "gap": this.getAttribute(CDefDesignProperty.GAP),
              "align-items": this.getAttribute(CDefDesignProperty.ALIGN_ITEMS),
              "justify-content": this.getAttribute(CDefDesignProperty.JUSTIFY_CONTENT),
              "flex-direction": [this.getAttribute('_layoutDirection'), "column"],
            })};
            ${layoutsToCss(this)}
          }</style>
          <slot></slot>
        `;
    }
}

declare global {
  interface HTMLElementTagNameMap {
    'dmo-container': DmoContainer;
  }
}