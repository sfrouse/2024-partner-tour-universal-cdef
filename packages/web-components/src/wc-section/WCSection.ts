import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {
  define,
  defineSlot,
} from '@contentful-demos/component-definitions/dist/';
import styles from './WCSection.scss';

export enum WCSectionContentMaxWidthEnum {
  Medium = 'medium',
  Small = 'small',
  Full = 'full'
}

export enum WCSectionPaddingEnum {
  Large = 'large',
  Medium = 'medium',
  Small = 'small'
}

export enum WCSectionDesignEnum {
  Default = 'default',
  Subdued = 'subdued',
  Minimal = 'minimal',
  Primary = 'primary'
}

@defineSlot('Body', 'body', {defaultSlot: true})

@customElement('wc-section')
export class WCSection extends LitElement {

  static styles = styles; 

  @define('Title', {content: true})
  @property({reflect: true})
    title: string = '';

  @define('Page Max Width', {
    options: WCSectionContentMaxWidthEnum,
    attribute: 'page-max-width'
  })
  @property({reflect: true, attribute: 'page-max-width'})
    pageMaxWidth: WCSectionContentMaxWidthEnum = WCSectionContentMaxWidthEnum.Medium;

  @define('Vertical Padding', {
    options: WCSectionPaddingEnum,
    attribute: 'vertical-padding'
  })
  @property({reflect: true, attribute: 'vertical-padding'})
    verticalPadding: WCSectionPaddingEnum = WCSectionPaddingEnum.Medium;

  @define('Design', {options: WCSectionDesignEnum})
  @property({reflect: true})
    design: WCSectionDesignEnum = WCSectionDesignEnum.Minimal;

  constructor() {
    super();
  }
 
  /**
   * render
   * @return {object}
   */
  render(): object {
    this.setAttribute('data-layout-direction', 'vertical');
    
    return html`
      <div>
        <div class="name">[SECTON: ${this.title}]</div>
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'wc-section': WCSection;
  }
}