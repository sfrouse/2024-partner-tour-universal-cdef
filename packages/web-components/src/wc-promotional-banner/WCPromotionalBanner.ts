import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import {define, defineExample, defineSlot} from '@contentful-demos/component-definitions/dist/';
import styles from './WCPromotionalBanner.scss';
import getLayoutPositionCss, { LayoutPositions } from '../utils/getLayoutPositionCss';

/**
 * @name Promo Banner
 * @slot Background Image, backgroundImage, true, {ref: 'cdef-image'}
 * @slot Background Image, backgroundImage, true, wc-button
 */
@defineSlot('Image', 'image', {ref: 'wc-image'})
@defineSlot('Background Image', 'backgroundImage', {ref: 'cdef-image'})
@defineSlot('Call to Actions', 'callToActions', {items:{ref: 'wc-button'}})
@defineSlot('Image Layers', 'imageLayers', {items:{ref: 'wc-image'}})
@defineExample('Tesla', 'wc-promotional-banner-simple', 'Example with Teslas')
@customElement('wc-promotional-banner')
export class WCPromotionalBanner extends LitElement {

  static styles = styles;

  /** Title */
  @define('Title', {content: true})
  @property({reflect: true})
    title = 'Banner Title';

  /** 
   * @label Page Max Width
   * @cdefMax 1800
   * @cdefMin 600
   */
  @define('Page Max Width', {max: 1800, min: 600, attribute: 'page-max-width'})
  @property({type: Number, attribute: 'page-max-width'})
    pageMaxWidth: number = 1000;

  /** Body */
  @define('Body', {content: true, ref: 'cdef-richtext'})
  @property()
    body: string = "Something";
  
  /** Inverse Text */
  @define('Inverse Text')
  @property({type: Boolean})
    inverse = false;

  /** Hide Text */
  @define('Hide Text',{attribute: 'hide-text'})
  @property({type: Boolean, attribute: 'hide-text'})
    hideText = false;

  /** Text Position */
  @define('Text Position',{options: LayoutPositions})
  @property({type: LayoutPositions})
    position: LayoutPositions = LayoutPositions['Top Left'];

  /** Horizontal Offset */
  @define('Horizontal Offset',{max: 100, min: -100, attribute: 'horizontal-offset'})
  @property({type: Number, attribute: 'horizontal-offset'})
    horizontalOffset: number = 0;

  /** Vertical Offset */
  @define('Vertical Offset', {max: 100, min: -100, attribute: 'vertical-offset'})
  @property({type: Number, attribute: 'vertical-offset'})
    verticalOffset: number = 0;

  /** Text Width */
  @define('Text Width (%)',{max: 100, min: 30, attribute: 'text-width'})
  @property({type: Number, attribute: 'text-width'})
    textWidth: number = 50;

  constructor() {
    super();
  }

  renderStyle(prop: string, value: any, suffix: string = 'px') {
    if (value !== undefined) {
      return `${prop}: ${value}${suffix};`;
    }
    return '';
  }

  /**
   * render
   * @return {object}
   */
  render(): object {

    const css = this.hideText ? 'display: none !important;' : `
      ${getLayoutPositionCss(
        this.position,
        this.verticalOffset, this.horizontalOffset
      )}
      width: ${this.textWidth}%;
    `;

    return html`
      <div class="root">
        <slot name="backgroundImage">
          <img
            src="https://via.placeholder.com/1200x700"
            alt="default image" />
        </slot>
        <div class="page" style="max-width: ${this.pageMaxWidth}px;">
          <div class="content" style="${css}">
            <h1>${this.title}</h1>
            <slot name="body">
              <p>${unsafeHTML(this.body)}</p>
            </slot>
            <slot name="callToActions"></slot>
          </div>
          <slot name="image">
            <wc-image
              image="https://via.placeholder.com/700x1100"
              size-percent="90"
              position="${LayoutPositions['Right Center']}">
            </wc-image>
          </slot>
          <slot name="imageLayers"></slot>
          <!-- <div
            class="image"
            style="background-image: url('$ {this.image}')"
            title="$ {this.imageDescription}"
            alt="$ {this.imageDescription}">
          </div> -->
        </div>
        <!-- <div class="imageLayers"
          style="max-width: ${this.pageMaxWidth}px;">
          
        </div> -->
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'wc-promotional-banner': WCPromotionalBanner;
  }
}