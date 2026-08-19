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

// --- Tabs: a tablist plus panels, with roving focus and arrow-key selection ---
class GraspTabs extends HTMLElement {
  connectedCallback() {
    if (this._built) return;
    this._built = true;
    this.classList.add('grasp-tabs');
    const list = this.querySelector('.grasp-tabs__list');
    this._panels = Array.from(this.querySelectorAll('.grasp-tabs__panel'));
    if (!list) return;
    list.setAttribute('role', 'tablist');
    this._tabs = Array.from(list.querySelectorAll('button'));
    this._tabs.forEach((tab, i) => {
      const panel = this._panels[i];
      if (!tab.id) tab.id = nextId('grasp-tab');
      tab.setAttribute('role', 'tab');
      tab.classList.add('grasp-tabs__tab');
      if (panel) {
        if (!panel.id) panel.id = nextId('grasp-panel');
        tab.setAttribute('aria-controls', panel.id);
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('aria-labelledby', tab.id);
        panel.tabIndex = 0;
      }
      tab.addEventListener('click', () => this._select(i));
      tab.addEventListener('keydown', (e) => this._onKey(e, i));
    });
    this._select(0);
  }
  _select(i) {
    this._tabs.forEach((tab, j) => {
      const on = j === i;
      tab.setAttribute('aria-selected', on ? 'true' : 'false');
      tab.tabIndex = on ? 0 : -1;
      if (this._panels[j]) this._panels[j].hidden = !on;
    });
  }
  _onKey(e, i) {
    const n = this._tabs.length;
    let next = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % n;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + n) % n;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = n - 1;
    if (next !== null) { e.preventDefault(); this._select(next); this._tabs[next].focus(); }
  }
}

// --- Tooltip: a bubble shown on hover and focus, dismissed on Escape ---
class GraspTooltip extends HTMLElement {
  connectedCallback() {
    if (this._built) return;
    this._built = true;
    this.classList.add('grasp-tooltip');
    const trigger = this.querySelector('button, a, [tabindex]') || this.firstElementChild;
    const text = this.getAttribute('text') || '';
    if (!trigger || !text) return;
    const tip = document.createElement('span');
    tip.className = 'grasp-tooltip__bubble';
    tip.setAttribute('role', 'tooltip');
    tip.id = nextId('grasp-tooltip');
    tip.textContent = text;
    tip.hidden = true;
    this.appendChild(tip);
    trigger.setAttribute('aria-describedby', tip.id);
    const show = () => { tip.hidden = false; };
    const hide = () => { tip.hidden = true; };
    trigger.addEventListener('mouseenter', show);
    trigger.addEventListener('mouseleave', hide);
    trigger.addEventListener('focus', show);
    trigger.addEventListener('blur', hide);
    trigger.addEventListener('keydown', (e) => { if (e.key === 'Escape') hide(); });
  }
}

// --- Accordion: header buttons that expand their panels (add `single` for one at a time) ---
class GraspAccordion extends HTMLElement {
  connectedCallback() {
    if (this._built) return;
    this._built = true;
    this.classList.add('grasp-accordion');
    const single = this.hasAttribute('single');
    const headers = Array.from(this.querySelectorAll('.grasp-accordion__header'));
    headers.forEach((header) => {
      const panel = header.nextElementSibling;
      if (!panel || !panel.classList.contains('grasp-accordion__panel')) return;
      if (!header.id) header.id = nextId('grasp-acc-h');
      if (!panel.id) panel.id = nextId('grasp-acc-p');
      header.setAttribute('aria-expanded', 'false');
      header.setAttribute('aria-controls', panel.id);
      panel.setAttribute('role', 'region');
      panel.setAttribute('aria-labelledby', header.id);
      panel.hidden = true;
      header.addEventListener('click', () => {
        const open = header.getAttribute('aria-expanded') === 'true';
        if (single && !open) {
          headers.forEach((h) => {
            if (h !== header) {
              h.setAttribute('aria-expanded', 'false');
              const p = h.nextElementSibling;
              if (p && p.classList.contains('grasp-accordion__panel')) p.hidden = true;
            }
          });
        }
        header.setAttribute('aria-expanded', open ? 'false' : 'true');
        panel.hidden = open;
      });
    });
  }
}

// --- Combobox: an input plus a filtered listbox, navigated by virtual focus ---
class GraspCombobox extends HTMLElement {
  connectedCallback() {
    if (this._built) return;
    this._built = true;
    this.classList.add('grasp-combobox');
    this._input = this.querySelector('input');
    this._list = this.querySelector('.grasp-combobox__list') || this.querySelector('[role="listbox"]');
    if (!this._input || !this._list) return;
    if (!this._list.id) this._list.id = nextId('grasp-combobox-list');
    this._input.setAttribute('role', 'combobox');
    this._input.setAttribute('aria-expanded', 'false');
    this._input.setAttribute('aria-controls', this._list.id);
    this._input.setAttribute('aria-autocomplete', 'list');
    this._input.setAttribute('autocomplete', 'off');
    this._list.setAttribute('role', 'listbox');
    this._options = Array.from(this._list.querySelectorAll('.grasp-combobox__option, [role="option"]'));
    this._options.forEach((opt) => {
      opt.setAttribute('role', 'option');
      opt.classList.add('grasp-combobox__option');
      if (!opt.id) opt.id = nextId('grasp-option');
      opt.addEventListener('click', () => this._choose(opt));
    });
    this._active = -1;
    this._input.addEventListener('input', () => { this._filter(); this.open(); });
    this._input.addEventListener('keydown', (e) => this._onKey(e));
    this._input.addEventListener('focus', () => { if (this._input.value) this.open(); });
    this._onDoc = (e) => { if (!this.contains(e.target)) this.close(); };
  }
  _visible() { return this._options.filter((o) => !o.hidden); }
  _filter() {
    const q = this._input.value.trim().toLowerCase();
    this._options.forEach((o) => { o.hidden = !!q && !o.textContent.toLowerCase().includes(q); });
    this._setActive(-1);
  }
  open() {
    if (this.hasAttribute('open') || !this._visible().length) return;
    this.setAttribute('open', '');
    this._input.setAttribute('aria-expanded', 'true');
    document.addEventListener('click', this._onDoc, true);
  }
  close() {
    if (!this.hasAttribute('open')) return;
    this.removeAttribute('open');
    this._input.setAttribute('aria-expanded', 'false');
    this._setActive(-1);
    document.removeEventListener('click', this._onDoc, true);
  }
  _setActive(i) {
    const vis = this._visible();
    this._options.forEach((o) => o.setAttribute('aria-selected', 'false'));
    if (i >= 0 && i < vis.length) {
      this._active = i;
      this._activeEl = vis[i];
      vis[i].setAttribute('aria-selected', 'true');
      this._input.setAttribute('aria-activedescendant', vis[i].id);
      vis[i].scrollIntoView({ block: 'nearest' });
    } else {
      this._active = -1;
      this._activeEl = null;
      this._input.removeAttribute('aria-activedescendant');
    }
  }
  _move(delta) {
    const vis = this._visible();
    if (!vis.length) return;
    this.open();
    let i = this._active + delta;
    if (i < 0) i = vis.length - 1;
    if (i >= vis.length) i = 0;
    this._setActive(i);
  }
  _choose(opt) {
    this._input.value = opt.textContent.trim();
    this.close();
    this._input.focus();
    this.dispatchEvent(new CustomEvent('grasp-select', { bubbles: true, detail: { value: opt.textContent.trim() } }));
  }
  _onKey(e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); this._move(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); this._move(-1); }
    else if (e.key === 'Enter') { if (this._activeEl) { e.preventDefault(); this._choose(this._activeEl); } }
    else if (e.key === 'Escape') { e.preventDefault(); this.close(); }
  }
}

if (typeof window !== 'undefined' && window.customElements) {
  const defs = {
    'grasp-field': GraspField,
    'grasp-modal': GraspModal,
    'grasp-menu': GraspMenu,
    'grasp-tabs': GraspTabs,
    'grasp-tooltip': GraspTooltip,
    'grasp-accordion': GraspAccordion,
    'grasp-combobox': GraspCombobox,
  };
  for (const [tag, cls] of Object.entries(defs)) {
    if (!customElements.get(tag)) customElements.define(tag, cls);
  }
}

export { GraspField, GraspModal, GraspMenu, GraspTabs, GraspTooltip, GraspAccordion, GraspCombobox };
