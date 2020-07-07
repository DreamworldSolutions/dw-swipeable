
import { LitElement } from '@dw/pwa-helpers';
import { html, css } from 'lit-element';
import { flexLayout } from '@dreamworld/flex-layout/flex-layout';
import { positioning } from '@dreamworld/flex-layout/flex-layout-positioning';
import { alignment } from '@dreamworld/flex-layout/flex-layout-alignment';
import { typography } from '@dreamworld/material-styles/typography';


/**
 * It is a component to provide way to trigger action on swipe left/right.
 * It's usefull to perform "Archive" or "Trash" action.
 * 
 * User can customize action placeholder background color, icon & text.
 * Behavior
 *  - On connected, 
 *    - Starts listen on "touchstart", "touchmove" & "touchend" events.
 * 
 *  - On swipe
 *    - When user swipes more than threshold, starts swiping content based on direction.
 * 
 *  - On swipe end
 *    - When use swiped more than half of content or swiping velocity is more than provided,
 *      swipes content 100% by javascript animation & dispatch `action` event based on direction
 *      Otherwise resets content position by javascript animation.
 * 
 *  - On disconnected, 
 *    - Unlistens all touch events.
 * 
 *  - Rendering
 *    - Content of item is rendered in light dom.
 *    - On swipe left/right, swipe content left/right,
 * 
 *  - On Swipe left/right
 *    - swipes content left/right.
 * 
 *  - On action,
 *    - Dispatch `action` event with detail e.g {detail: {name: {actionName}}} 
 * 
 * USAGE PATTERN: 
 *   <dw-swipeable .leftAction="${left: {name: 'DELETE', caption: 'Delete', icon: 'delete'}, rightAction: {name: 'DELETE', caption: 'Delete'} }" >
 *    <div>Content Here</div>
 *    </dw-swipeable>
 *   
 *    CSS Variables:
 *      --swipe-left-placeholder-color: Text color of left action placeholder.
 *      --swipe-left-placeholder-bg-color: Background color of left action placeholder
 *      --swipe-right-placeholder-color: Text color of right action placeholder.
 *      --swipe-right-placeholder-bg-color: Background color of right action placeholder
 *      --swipe-content-bg-color: Background color of content
 */

class DwSwipeable extends LitElement {
  static get styles() {
    return [
      flexLayout,
      positioning,
      alignment,
      typography,
      css`
        :host {
          display: block;
          position: relative;
          overflow: hidden;
        }

        .content{
          will-change: transform;
          background-color: var(--swipe-content-bg-color, #FFF);
        }

        .left-action-placeholder, .right-action-placeholder{
          position: absolute;
          top: 0;
          bottom: 0;
          z-index: 0;
          width: 100px;
          will-change: transform;
        }

        .left-action-placeholder{
          right: -100px;
          color: var(--swipe-left-placeholder-color, #FFF);
          background: var(--swipe-left-placeholder-bg-color, red);
          transform-origin: left top;
        }

        .right-action-placeholder{
          left: -100px;
          color: var(--swipe-right-placeholder-color, #FFF);
          background: var(--swipe-right-placeholder-bg-color, red);
          transform-origin: right top;
        }

        .placeholder-content{
          will-change: transform;
          transform: 'scaleX(0)';
          text-transform: uppercase;
          padding: 8px 16px;
        }

        .left-action-placeholder .placeholder-content{
          transform-origin: right top;
        }

        .right-action-placeholder .placeholder-content{
          transform-origin: left top;
        }

        kerika-icon{
          margin-right: 4px;
        }

        .left-action-icon{
          --dw-icon-color: var(--swipe-left-placeholder-color, #FFF);
          transform-origin: right;
        }

        .right-action-icon{
          --dw-icon-color: var(--swipe-right-placeholder-color, #FFF);
        }
      `
    ];
  }


  constructor() {
    super();
    this.threshold = 10;
    this.velocity = 0.3;
    this.animationTime = 200;
  }

  connectedCallback() {
    super.connectedCallback && super.connectedCallback();
    this.updateComplete.then(() => {
      this._content = this.shadowRoot.querySelector('.content');
      this._content.addEventListener('touchstart', this._onTouchStart.bind(this));
      this._content.addEventListener('touchmove', this._onTouchMove.bind(this));
      this._content.addEventListener('touchend', this._onTouchEnd.bind(this));

      if (this.leftAction) {
        this._leftActionPlaceholder = this.shadowRoot.querySelector('.left-action-placeholder');
        this._leftActionPlaceholderContent = this.shadowRoot.querySelector('.left-action-placeholder .placeholder-content');
      }

      if (this.rightAction) {
        this._rightActionPlaceholder = this.shadowRoot.querySelector('.right-action-placeholder');
        this._rightActionPlaceholderContent = this.shadowRoot.querySelector('.right-action-placeholder .placeholder-content');
      }
    })
  }

  disconnectedCallback() {
    super.disconnectedCallback && super.disconnectedCallback();
    this._content.removeEventListener('touchstart', this._onTouchStart);
    this._content.removeEventListener('touchmove', this._onTouchMove);
    this._content.removeEventListener('touchend', this._onTouchEnd);
  }

  static get properties() {
    return {
      /**
       * Input property. Action name & Placeholder text/icon for left action. {name:'DELETE', caption: 'Delete', icon: 'delete'}
       */
      leftAction: { type: Object },

      /**
       * Input property. Action name & Placeholder text/icon for right action. {name:'DELETE', caption: 'Delete', icon: 'delete'}
       */
      rightAction: { type: Object },

      /**
       * Input property. Minimum threshold from which swipe will start. 
       * Default is 10;
       */
      threshold: { type: Number },

      /**
       * Input property. Minimum velocty of swipe (pixel per milliseconds).
       * Default is 0.3
       */
      velocity: { type: Number },

      /**
       * Input property. Time of animation. Default is 200 milliseconds.
       */
      animationTime: { type: Number }
    };
  }

  render() {
    return html`
        ${this.leftAction ? html`
          <div name="${this.leftAction.name}" 
            class="left-action-placeholder layout horizontal center end-justified">
            <div class="placeholder-content layout horizontal center body1">
              ${this.leftAction.icon ? html`
                <kerika-icon class="left-action-icon" name=${this.leftAction.icon}></kerika-icon>
              ` : ''}
              <div>${this.leftAction.caption}</div>
            </div>
          </div>` : ''}
        
        ${this.rightAction ? html`
        <div name="${this.rightAction.name}" 
          class="right-action-placeholder layout horizontal center">
          <div class="placeholder-content layout horizontal center body1">
            ${this.rightAction.icon ? html`
                <kerika-icon class="right-action-icon" name=${this.rightAction.icon}></kerika-icon>
              ` : ''}
            <div>${this.rightAction.caption}</div>
          </div>
        </div>` : ''}
      
        <div class="content">
          <slot></slot>
        </div>
    `
  }

  /**
   * Store touch start co-ordinates & time into instance properties.
   * @param {Object} e Event
   */
  _onTouchStart(e) {
    this._touchStartPoints = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
    this._touchStartTime = new Date().getTime();
  }

  /**
   * If swipe direction is horizontal & 
   * difference between startPoints & currentPoinst is more then threshold, 
   * swipes content & action placeholders based on direction.
   * @param {Object} e Event
   */
  _onTouchMove(e) {
    const currentPoints = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
    const diff = [(currentPoints[0] - this._touchStartPoints[0]), (currentPoints[1] - this._touchStartPoints[1])];
    const diffX = diff[0];
    const diffY = diff[1];
    if (this._translateX === undefined && (Math.abs(diffX) / Math.abs(diffY) < 1 ||
        Math.abs(diffY) > this.offsetHeight || Math.abs(diffX) <= this.threshold)) {
      return;
    }

    this._transform(diffX);
  }

  /**
   * Calculate velocity based on time & swipe difference.
   * When user has swiped more than half width of content or velocity of swipe is more than 0.3,
   *    - swipe whole content & action placeholders 100% by javascript animation & dipatches `action` event based on direction.
   * otherwise resets content & action placeholders positon by javascript animation.
   * 
   * @param {Object} e Event
   */
  _onTouchEnd(e) {
    if (this._translateX === undefined) {
      return;
    }
    const currentPoints = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
    const currentTime = new Date().getTime();
    const diffX = currentPoints[0] - this._touchStartPoints[0];
    const timeDiff = currentTime - this._touchStartTime;
    const velocity = Math.abs(diffX) / (timeDiff)

    if (velocity > this.velocity || Math.abs(diffX) > (this.offsetWidth / 2)) {
      this._swipe();
    } else {
      this._reset();
    }

  }

  /**
   * Swipes content fully & dispatches event based on direction.
   */
  _swipe() {
    const direction = this._translateX < 0 ? 'LEFT' : 'RIGHT';
    const diff = this._translateX < 0 ? -(this.offsetWidth) - this._translateX : this.offsetWidth - this._translateX;
    const pixelPerFrame = Math.abs(diff / (this.animationTime * 0.06));
    const step = () => {
      if (Math.abs(this._translateX) >= this.offsetWidth) {
        this._dispatchAction(direction);
        this._translateX = undefined;
        return;
      }
      const transformX = direction === 'LEFT' ? Math.max(this._translateX - pixelPerFrame, -this.offsetWidth) : Math.min(this._translateX + pixelPerFrame, this.offsetWidth);
      this._transform(transformX);
      window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }

  /**
   * Resets content to it's original position.
   */
  _reset() {
    const direction = this._translateX < 0 ? 'LEFT' : 'RIGHT';
    const pixelPerFrame = Math.abs(this._translateX / (this.animationTime * 0.06));
    const step = () => {
      if ((direction === 'LEFT' && this._translateX >= 0) || (direction === 'RIGHT' && this._translateX <= 0)) {
        this._translateX = undefined;
        return;
      }
      const transformX = direction === 'LEFT' ? Math.min(this._translateX + pixelPerFrame, 0) : Math.max(this._translateX - pixelPerFrame, 0);
      this._transform(transformX);
      window.requestAnimationFrame(step);
      
    }
    window.requestAnimationFrame(step);
  }

  /**
   * Transform contets.
   * @param {Number} position Number of pixels to be swiped
   */
  _transform(position) {
    this._translateX = position < 0 ? Math.max(position, -(this.offsetWidth)) : Math.min(position, this.offsetWidth);
    this._scaleX = Math.max(1, Math.abs(this._translateX / 100));
    this._placeholderTextScaleX = Math.min(1, 100 / Math.abs(this._translateX));

    this._content.style.transform = `translateX(${this._translateX}px)`

    if (this.leftAction) {
      this._leftActionPlaceholder.style.transform = `translateX(${this._translateX}px) scaleX(${this._scaleX}`;
      this._leftActionPlaceholderContent.style.transform = `scaleX(${this._placeholderTextScaleX})`;
    }

    if (this.rightAction) {
      this._rightActionPlaceholder.style.transform = `translateX(${this._translateX}px) scaleX(${this._scaleX}`;
      this._rightActionPlaceholderContent.style.transform = `scaleX(${this._placeholderTextScaleX})`;
    }
  }

  /**
   * Dispatches `action` event {detail: {name: {actionName}}}
   */
  _dispatchAction(action) {
    let actionName;
    if (action === 'LEFT' && this.leftAction) {
      actionName = this.leftAction.name;
    } else if (action === 'RIGHT' && this.rightAction) {
      actionName = this.rightAction.name;
    }

    if (!actionName) {
      return;
    }

    this.dispatchEvent(new CustomEvent('action', { detail: { name: actionName } }, { bubbles: false }));
    
  }

}

window.customElements.define('dw-swipeable', DwSwipeable);
