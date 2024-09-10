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
import styles from './DMOButton.scss';

export enum DMOButtonEmphasisEnum {
  Bold = 'bold',
  Subtle = 'subtle',
  Minimal = 'minimal',
}

export enum DMOButtonDesignEnum {
  Primary = 'primary',
  Secondary = 'secondary',
}

@defineHidden('Interactive', 'interactive')
@defineExample('Simple', 'dmo-button', 'A basic, default button')
@defineExample('Secondary', 'dmo-button-secondary', 'A secondary styled button')

@defineComponent('DMO Button', {
  import: `import { DMOButton } from 'web-components/DMOButton'`,
  figmaComponent: 'https://www.figma.com/file/NnCJZBCicscdASjxwzoQ3J/Component-Definitions?type=design&node-id=7-322&mode=dev',
  hiddenProperties: ['interactive'],
  examples: [
    {
      name: 'Simple',
      path: './examples/dmo-button.cdef.inst.json',
      description: 'A basic, default button'},
    {
      name: 'Secondary',
      path: './examples/dmo-button-secondary.cdef.inst.json',
      description: 'A secondary styled button'
    },
  ],
  // slots: [
  //   {label: 'Body', property: 'body', defaultSlot: true}
  // ]
})

@customElement('dmo-button')
export class DMOButton extends LitElement {

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
    options: DMOButtonEmphasisEnum,
    description: 'How noticable the button is on the page'
  })
  @property({reflect: true})
    emphasis: DMOButtonEmphasisEnum = DMOButtonEmphasisEnum.Bold;

  @define('Design', {options: DMOButtonDesignEnum})
  @property({reflect: true})
    design: DMOButtonDesignEnum = DMOButtonDesignEnum.Primary;


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
    'dmo-button': DMOButton;
  }
}
