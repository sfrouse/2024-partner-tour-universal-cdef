import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {
  define,
  // defineStageCss
} from '@contentful-demos/component-definitions/dist/';
import styles from './scss/wc-image.scss';
import getLayoutPositionCss, { LayoutPositions } from '../utils/getLayoutPositionCss';

export enum ImageSizeDirections {
  width = 'width',
  height = 'height'
};

// @defineStageCss(`
//   position: relative;
//   height: 400px;
//   width: 100vw;
//   border: 1px solid #eee;
//   background-color: #eee;
//   box-sizing: border-box;
// `)

@customElement('wc-image')
export class WCImage extends LitElement {

  static styles = styles;

  /** Title */
  @define('Label', {content: true})
  @property({reflect: true})
    title = '';

  /** Image */
  @define('Image', {content: true, ref: 'cdef-image'})
  @property({reflect: true})
    image: string;

  /** Hide */
  @define('Hide')
  @property({type: Boolean})
    hide = false;

  /** Size */
  @define('Size (Percent)',{max: 100, min: 20, attribute: 'size-percent'})
  @property({type: Number, attribute: 'size-percent'})
    sizePercent: number = 100;

  @define('Size Direction',{options: ImageSizeDirections, attribute: 'size-direction'})
  @property({type: ImageSizeDirections, attribute: 'size-direction'})
    sizeDirection: ImageSizeDirections = ImageSizeDirections.height;

  @define('Horizontal Offset',{max: 100, min: -100, attribute: 'horizontal-offset'})
  @property({type: Number, attribute: 'horizontal-offset'})
    horizontalOffset: number = 0;

  @define('Vertical Offset',{max: 100, min: -100, attribute: 'vertical-offset'})
  @property({type: Number, attribute: 'vertical-offset'})
    verticalOffset: number = 0;

  @define('Position',{options: LayoutPositions})
  @property({type: LayoutPositions})
    position: LayoutPositions = LayoutPositions['Bottom Right'];

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
    const css = this.hide === true ? 'display: none !important;' : `
      ${this.sizeDirection === ImageSizeDirections.width ?
          this.renderStyle('width', this.sizePercent, '%') :
          this.renderStyle('height', this.sizePercent, '%')}
      ${getLayoutPositionCss(
        this.position,
        this.verticalOffset, this.horizontalOffset
      )}
    `;
    return html`
      <style>
          :host {
            ${css}
          }
      </style>
      <img
        src="${this.image}"
        alt="${this.title}"
        style="${`
          ${this.sizeDirection === ImageSizeDirections.width ?
            this.renderStyle('width', '100', '%') :
            this.renderStyle('height', '100', '%')}
        `}" />
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'wc-image': WCImage;
  }
}