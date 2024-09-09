import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {
  define,
  defineDesignProperty,
  defineSlot,
  layoutToCss,
  CDefDesignPropertyEnum,
  CDefLayoutValue 
} from '@contentful-demos/component-definitions/dist/';

export enum WCBackgroundColors {
  Primary = '#ffffff',
  Secondary = '--wc-color-background-default',
  Minimal = 'minimal',
}

/**
 * @name WCLayout
 * @figmaComponent FIGMA_TEXT_FIELD
 * @import import { WCLayout } from 'web-components/WCButton'
 * @slot Body, body, true
 */
@defineSlot('Body', 'body', {defaultSlot: true})
@defineDesignProperty(
  CDefDesignPropertyEnum.backgroundColor
)
@defineDesignProperty( CDefDesignPropertyEnum.textColor )
@defineDesignProperty( CDefDesignPropertyEnum.textAlign )
@defineDesignProperty( CDefDesignPropertyEnum.typography )
@defineDesignProperty( CDefDesignPropertyEnum.position )
@defineDesignProperty( CDefDesignPropertyEnum.containment )

@customElement('wc-layout')
export class WCLayout extends LitElement {

  // static styles = styles;

  /**
   * @label Label
   * @content
   */
  @define('Label', {content: true})
  @property({reflect: true})
    label: string = '';

  /**
   * @label Layout
   */
  @define('Layout',{inputType: 'layout'})
  @property({type: Object})
    layout: CDefLayoutValue = {};

  // @define('Design',{inputType: 'box-design'})
  // @property({type: Object})
  //   boxDesign: CDefBoxDesignValue = {};

  constructor() {
    super();
  }

  createRenderRoot() {
    return this; // Render in light DOM
  }
 
  /**
   * render
   * @return {object}
   */
  render(): object {

    const cssInfo = layoutToCss(this.layout);

    if (cssInfo) {
      this.setAttribute('data-layout-id', cssInfo.cssId );
      this.setAttribute('data-layout-direction',
        this.layout.direction ? this.layout.direction : 'horizontal'
      );
    }
    
    const cssStr = `
wc-layout {
  display: block;
  box-sizing: border-box;
}

[data-layout-id='${cssInfo.cssId}'] {
  border: 1px dashed lightblue;
}
[data-layout-id='${cssInfo.cssId}']:after {
  content: '[LAYOUT: ${this.label}]';
  position: absolute;
  top: 6px; left: 6px;
  background-color: rgba( 255, 255, 255, 0.5);
  font-size: 9px;
  padding: 4px;
  z-index: 100000;
}
  
*:not([data-layout-direction]) > [data-layout-id]:before {
  content: ' ';
  position: absolute;
  top: 0; left: 0; bottom: 0; right: 0;
  z-index: 100000;
  border: 2px dashed rgba(255,0,0, 0.3);
}
    `;

    return html`
      <style>
        ${cssInfo.css}
        ${cssStr}
      </style>
      <!-- <div class="name">[LAYOUT: ${this.label}]</div>
      <slot></slot> -->
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'wc-layout': WCLayout;
  }
}