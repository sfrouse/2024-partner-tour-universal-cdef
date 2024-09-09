import {LitElement, html} from 'lit';
import {
  customElement,
  property
} from 'lit/decorators.js';
import {
  defineExample,
  defineHidden,
  define,
  defineComponent
} from '@contentful-demos/component-definitions/dist';
import styles from './WCButton.scss';

export enum WCButtonEmphasisEnum {
  Bold = 'bold',
  Subtle = 'subtle',
  Minimal = 'minimal',
}

export enum WCButtonDesignEnum {
  Primary = 'primary',
  Secondary = 'secondary',
}

@defineHidden('Interactive', 'interactive')
@defineExample('Simple', 'wc-button', 'A basic, default button')
@defineExample('Secondary', 'wc-button-secondary', 'A secondary styled button')

@defineComponent('WC Button', {
  import: `import { WCButton } from 'web-components/WCButton'`,
  figmaComponent: 'https://www.figma.com/file/NnCJZBCicscdASjxwzoQ3J/Component-Definitions?type=design&node-id=7-322&mode=dev',
  hiddenProperties: ['interactive'],
  examples: [
    {
      name: 'Simple',
      path: './examples/wc-button.cdef.inst.json',
      description: 'A basic, default button'},
    {
      name: 'Secondary',
      path: './examples/wc-button-secondary.cdef.inst.json',
      description: 'A secondary styled button'
    },
  ],
  slots: [
    {label: 'Body', property: 'body', defaultSlot: true}
  ]
})

@customElement('wc-button')
export class WCButton extends LitElement {

  static styles = styles; 

  @define('Label', {content: true})
  @property({reflect: true})
    label: string = '';


  @define('URL', {
    content: true,
    description: 'This is the url used to link to...'
  })
  @property({reflect: true})
    url: string = '';
  

  @define('Disabled')
  @property({type: Boolean, reflect: true})
    disabled: boolean = false;


  @define('Target')
  @property({reflect: true})
    target: string;

  // @define('Boolean Example')
  // @property({type: Boolean, reflect: true, attribute: 'boolean-example'})
  //   booleanExample: boolean = false;

  @define('Emphasis', {
    options: WCButtonEmphasisEnum,
    description: 'How noticable the button is on the page'
  })
  @property({reflect: true})
    emphasis: WCButtonEmphasisEnum = WCButtonEmphasisEnum.Bold;

  @define('Design', {options: WCButtonDesignEnum})
  @property({reflect: true})
    design: WCButtonDesignEnum = WCButtonDesignEnum.Primary;


  handleClick(e: MouseEvent) {
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent('click', {bubbles: true, composed: true}));
  }

  render(): object {
    if (this.url) {
      return html`
        <a
          href="${this.disabled ? 'javascript:void(0);' : this.url}"
          target="${this.disabled ? '' : this.target}"
          onClick="${this.handleClick}">
          ${this.label || 'Button'}
          <slot name="test"></slot>
        </a>
      `;
    }

    return html`
      <button
        ?disabled="${this.disabled}"
        onClick="${this.handleClick}">
        ${this.label || 'Button'}
        <slot name="test"></slot>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'wc-button': WCButton;
  }
}
