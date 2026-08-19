/*
 * GRASP - the framework-agnostic core. Zero dependencies.
 *
 * Native-first: builds on <button>, native form controls, and the <dialog>
 * element, and hand-rolls behavior only where no native element covers the
 * pattern. Registers three custom elements:
 *   <grasp-field>  wires a label, hint, error, and aria to a native control.
 *   <grasp-modal>  wraps a native <dialog> (focus trap, Escape, focus return).
 *   <grasp-menu>   a keyboard-navigable menu (trigger plus a list of items).
 * The button is CSS: apply .grasp-button (and a variant) to a real <button>.
 *
 * License: Apache-2.0.
 */

let uid = 0;
const nextId = (p) => `${p}-${++uid}`;

// --- Field: wire label, hint, error, and aria to the author's native control ---
class GraspField extends HTMLElement {
  static get observedAttributes() { return ['label', 'hint', 'error']; }
  connectedCallback() { this._wire(); }
  attributeChangedCallback() { if (this.isConnected) this._wire(); }
  _wire() {
    const control = this.querySelector('input, select, textarea');
    if (!control) return;
    this.classList.add('grasp-field');
    if (!control.id) control.id = nextId('grasp-field');

    const labelText = this.getAttribute('label') || '';
    if (labelText) {
      if (!this._label) {
        this._label = document.createElement('label');
        this._label.className = 'grasp-field__label';
        this._label.setAttribute('for', control.id);
        this.insertBefore(this._label, this.firstChild);
      }
      this._label.textContent = labelText;
      if (control.required) {
        const req = document.createElement('span');
        req.className = 'grasp-field__req';
        req.setAttribute('aria-hidden', 'true');
        req.textContent = ' *';
        this._label.appendChild(req);
      }
    }

    const describedBy = [];

    const hintText = this.getAttribute('hint') || '';
    if (hintText) {
      if (!this._hint) {
        this._hint = document.createElement('p');
        this._hint.className = 'grasp-field__hint';
        this._hint.id = nextId('grasp-hint');
        control.after(this._hint);
      }
      this._hint.textContent = hintText;
      describedBy.push(this._hint.id);
    }

    const errorText = this.getAttribute('error') || '';
    if (errorText) {
      if (!this._error) {
        this._error = document.createElement('p');
        this._error.className = 'grasp-field__error';
        this._error.id = nextId('grasp-error');
        this.appendChild(this._error);
      }
      this._error.textContent = errorText;
      control.setAttribute('aria-invalid', 'true');
      describedBy.push(this._error.id);
    } else if (this._error) {
      this._error.remove();
      this._error = null;
      control.removeAttribute('aria-invalid');
    }

    if (describedBy.length) control.setAttribute('aria-describedby', describedBy.join(' '));
    else control.removeAttribute('aria-describedby');
  }
}

// --- Modal: a native <dialog>, driven by the `open` attribute ---
class GraspModal extends HTMLElement {
  static get observedAttributes() { return ['open']; }
  connectedCallback() { if (!this._dialog) this._build(); this._sync(); }
  attributeChangedCallback() { if (this._dialog) this._sync(); }
  _build() {
    const dialog = document.createElement('dialog');
    dialog.className = 'grasp-modal';
    const heading = this.getAttribute('heading');
    if (heading) {
      const h = document.createElement('h2');
      h.className = 'grasp-modal__title';
      h.id = nextId('grasp-modal-title');
      h.textContent = heading;
      dialog.setAttribute('aria-labelledby', h.id);
      dialog.appendChild(h);
    }
    while (this.firstChild) dialog.appendChild(this.firstChild);
    this.appendChild(dialog);
    this._dialog = dialog;
    // A native close (Escape or dialog.close()) syncs the attribute back out.
    dialog.addEventListener('close', () => {
      if (this.hasAttribute('open')) this.removeAttribute('open');
      this.dispatchEvent(new CustomEvent('grasp-close', { bubbles: true }));
    });
    // A click on the backdrop lands on the dialog element itself.
    dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
  }
  _sync() {
    const want = this.hasAttribute('open');
    if (want && !this._dialog.open) this._dialog.showModal();
    else if (!want && this._dialog.open) this._dialog.close();
  }
  open() { this.setAttribute('open', ''); }
  close() { this._dialog.close(); }
}

// --- Menu: trigger plus a list, with keyboard navigation ---
class GraspMenu extends HTMLElement {
  connectedCallback() {
    if (this._built) return;
    this._built = true;
    this.classList.add('grasp-menu');
    this._trigger = this.querySelector('.grasp-menu__trigger') || this.querySelector('button');
    this._list = this.querySelector('.grasp-menu__list') || this.querySelector('[role="menu"]');
    if (!this._trigger || !this._list) return;
    this._list.setAttribute('role', 'menu');
    this._trigger.setAttribute('aria-haspopup', 'menu');
    this._trigger.setAttribute('aria-expanded', 'false');
    this._items = Array.from(this._list.querySelectorAll('a, button'));
    this._items.forEach((it) => { it.classList.add('grasp-menu__item'); it.setAttribute('role', 'menuitem'); it.tabIndex = -1; });
    this._index = -1;

    this._trigger.addEventListener('click', (e) => { e.preventDefault(); this.toggle(); });
    this._trigger.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.open(); this._focus(0); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); this.open(); this._focus(this._items.length - 1); }
    });
    this._list.addEventListener('keydown', (e) => this._onKey(e));
    this._onDoc = (e) => { if (!this.contains(e.target)) this.close(); };
  }
  toggle() { this.hasAttribute('open') ? this.close() : this.open(); }
  open() {
    if (this.hasAttribute('open')) return;
    this.setAttribute('open', '');
    this._trigger.setAttribute('aria-expanded', 'true');
    document.addEventListener('click', this._onDoc, true);
  }
  close() {
    if (!this.hasAttribute('open')) return;
    this.removeAttribute('open');
    this._trigger.setAttribute('aria-expanded', 'false');
    document.removeEventListener('click', this._onDoc, true);
    this._index = -1;
  }
  _focus(i) {
    const n = this._items.length;
    if (!n) return;
    this._index = (i + n) % n;
    this._items[this._index].focus();
  }
  _onKey(e) {
    switch (e.key) {
      case 'ArrowDown': e.preventDefault(); this._focus(this._index + 1); break;
      case 'ArrowUp': e.preventDefault(); this._focus(this._index - 1); break;
      case 'Home': e.preventDefault(); this._focus(0); break;
      case 'End': e.preventDefault(); this._focus(this._items.length - 1); break;
      case 'Escape': e.preventDefault(); this.close(); this._trigger.focus(); break;
      case 'Tab': this.close(); break;
    }
  }
}

if (typeof window !== 'undefined' && window.customElements) {
  const defs = { 'grasp-field': GraspField, 'grasp-modal': GraspModal, 'grasp-menu': GraspMenu };
  for (const [tag, cls] of Object.entries(defs)) {
    if (!customElements.get(tag)) customElements.define(tag, cls);
  }
}

export { GraspField, GraspModal, GraspMenu };
