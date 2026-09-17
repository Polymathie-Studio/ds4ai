/*
 * GRACE - the framework-agnostic core. Zero dependencies.
 *
 * Registers three custom elements that render an accessible off-happy-path state
 * from attributes: <grace-empty>, <grace-error>, and <grace-notfound>. The
 * pending state (Skeleton) is CSS only: apply the .grace-skeleton class to a
 * placeholder box, shaped like what will arrive.
 *
 * Attributes: heading, message, action (the label), href (makes the action a
 * link). With no href the action is a button that dispatches a bubbling
 * 'grace-action' event the host listens for, which is how an error offers retry.
 *
 * License: Apache-2.0.
 */

const KINDS = {
  'grace-empty': { role: 'status', live: 'polite', mod: 'empty' },
  'grace-error': { role: 'alert', live: 'assertive', mod: 'error' },
  'grace-notfound': { role: 'status', live: 'polite', mod: 'notfound' },
};

class GraceState extends HTMLElement {
  static get observedAttributes() {
    return ['heading', 'message', 'action', 'href'];
  }
  connectedCallback() {
    this._render();
  }
  attributeChangedCallback() {
    if (this.isConnected) this._render();
  }
  _render() {
    const kind = KINDS[this.tagName.toLowerCase()];
    if (!kind) return;
    this.classList.add('grace-state', 'grace-state--' + kind.mod);
    this.setAttribute('role', kind.role);
    if (!this.hasAttribute('aria-live')) this.setAttribute('aria-live', kind.live);

    const heading = this.getAttribute('heading') || '';
    const message = this.getAttribute('message') || '';
    const action = this.getAttribute('action') || '';
    const href = this.getAttribute('href') || '';

    const frag = document.createDocumentFragment();
    if (heading) {
      const h = document.createElement('p');
      h.className = 'grace-state__title';
      h.textContent = heading;
      frag.appendChild(h);
    }
    if (message) {
      const m = document.createElement('p');
      m.className = 'grace-state__message';
      m.textContent = message;
      frag.appendChild(m);
    }
    if (action) {
      let a;
      if (href) {
        a = document.createElement('a');
        a.href = href;
      } else {
        a = document.createElement('button');
        a.type = 'button';
        a.addEventListener('click', () => {
          this.dispatchEvent(new CustomEvent('grace-action', { bubbles: true }));
        });
      }
      a.className = 'grace-state__action';
      a.textContent = action;
      frag.appendChild(a);
    }
    this.replaceChildren(frag);
  }
}

if (typeof window !== 'undefined' && window.customElements) {
  for (const tag of Object.keys(KINDS)) {
    if (!customElements.get(tag)) {
      customElements.define(tag, class extends GraceState {});
    }
  }
}

export { GraceState };
