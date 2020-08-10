/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { LitElement, html, css} from 'lit-element';
import '../dw-swipeable.js';

class DwSwipeableDemo extends LitElement {
  static get styles() {
    return [
      css`
       :host{
         display: block;
         --dw-icon-color-active-on-dark: #fff;
         --mdc-theme-text-primary-on-dark: #fff;
        }
        
        h3{
          margin: 24px 0 16px  0;
        }
      `
    ];
  }

  render() {
    return html`
      <h3>Demo</h3>
      <dw-swipeable 
        @action=${this._onAction}
        .leftAction=${{name: 'DELETE', caption: 'Delete', icon: 'delete'}}
        .rightAction=${{name: 'DELETE', caption: 'Delete'} } >
        <h3>Conntent is here</h3>
      </dw-swipeable>

    `;
  }


  _onAction(e) {
    console.log(e.detail);
    alert(e.detail.name);
  }

}

window.customElements.define('dw-swipeable-demo', DwSwipeableDemo);