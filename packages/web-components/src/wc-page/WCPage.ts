import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {
  define,
  defineSlot,
} from '@contentful-demos/component-definitions/dist/';
import styles from './WCPage.scss';


export enum WCPageDesignEnum {
  Primary = 'primary',
  Secondary = 'secondary',
}

@defineSlot('Body', 'body', {defaultSlot: true})

@customElement('wc-page')
export class WCPage extends LitElement {

  static styles = styles; 

  @define('Title', {content: true})
  @property({reflect: true})
    title: string = '';

  @define('Slug', {content: true})
  @property({reflect: true})
    slug: string = '';

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
        <div class="name">[PAGE: ${this.title}]</div>
        <div class="header">header</div>
        <slot></slot>
        <div class="footer">footer</div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'wc-page': WCPage;
  }
}