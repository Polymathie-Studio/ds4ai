/*
 * GRASP - the framework-agnostic core. Zero dependencies.
 *
 * Native-first: builds on <button>, native form controls, the <dialog>
 * element, and the native Popover API, and hand-rolls behavior only where no
 * native element covers the pattern. It registers the custom elements that need
 * script (field, modal, menu, tabs, tooltip, accordion, combobox, toolbar,
 * toast region, popover); the button, form controls, slider, spinbutton,
 * progress, meter, breadcrumb, and toggle group are CSS over native markup.
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

// --- Toolbar: a group of controls with one tab stop and roving arrow-key focus ---
class GraspToolbar extends HTMLElement {
  connectedCallback() {
    if (this._built) return;
    this._built = true;
    this.classList.add('grasp-toolbar');
    this.setAttribute('role', 'toolbar');
    this._vertical = this.getAttribute('orientation') === 'vertical';
    if (this._vertical) this.setAttribute('aria-orientation', 'vertical');
    this._items = Array.from(this.querySelectorAll('button, a[href], [role="button"]'));
    if (!this._items.length) return;
    this._index = 0;
    this._items.forEach((it, i) => { it.tabIndex = i === 0 ? 0 : -1; });
    this.addEventListener('keydown', (e) => this._onKey(e));
    this.addEventListener('focusin', (e) => {
      const i = this._items.indexOf(e.target);
      if (i >= 0) this._set(i);
    });
  }
  _set(i) {
    const n = this._items.length;
    this._index = (i + n) % n;
    this._items.forEach((it, j) => { it.tabIndex = j === this._index ? 0 : -1; });
  }
  _focus(i) { this._set(i); this._items[this._index].focus(); }
  _onKey(e) {
    const next = this._vertical ? 'ArrowDown' : 'ArrowRight';
    const prev = this._vertical ? 'ArrowUp' : 'ArrowLeft';
    switch (e.key) {
      case next: e.preventDefault(); this._focus(this._index + 1); break;
      case prev: e.preventDefault(); this._focus(this._index - 1); break;
      case 'Home': e.preventDefault(); this._focus(0); break;
      case 'End': e.preventDefault(); this._focus(this._items.length - 1); break;
    }
  }
}

// --- Toast region: a live region with a push API; each toast is status or alert ---
class GraspToastRegion extends HTMLElement {
  connectedCallback() {
    if (this._built) return;
    this._built = true;
    this.classList.add('grasp-toast-region');
    this.setAttribute('aria-live', this.hasAttribute('assertive') ? 'assertive' : 'polite');
    this.setAttribute('aria-atomic', 'false');
  }
  show(message, opts = {}) {
    const t = document.createElement('div');
    t.className = 'grasp-toast' + (opts.variant ? ' grasp-toast--' + opts.variant : '');
    t.setAttribute('role', opts.assertive ? 'alert' : 'status');
    const text = document.createElement('span');
    text.className = 'grasp-toast__text';
    text.textContent = message;
    t.appendChild(text);
    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'grasp-toast__close';
    close.setAttribute('aria-label', 'Dismiss');
    close.textContent = '×';
    close.addEventListener('click', () => this._dismiss(t));
    t.appendChild(close);
    this.appendChild(t);
    const duration = opts.duration == null ? 5000 : opts.duration;
    if (duration > 0) t._timer = setTimeout(() => this._dismiss(t), duration);
    return t;
  }
  _dismiss(t) {
    if (t._timer) clearTimeout(t._timer);
    t.remove();
  }
}

// Convenience: push a toast onto a default region, creating it on first use.
function toast(message, opts = {}) {
  if (typeof document === 'undefined') return null;
  let region = document.querySelector('grasp-toast-region[data-default]');
  if (!region) {
    region = document.createElement('grasp-toast-region');
    region.setAttribute('data-default', '');
    document.body.appendChild(region);
  }
  return region.show(message, opts);
}

// --- Popover: the native Popover API for behavior, a shim only for placement ---
class GraspPopover extends HTMLElement {
  connectedCallback() {
    if (this._built) return;
    this._built = true;
    this.classList.add('grasp-popover');
    this._trigger = this.querySelector('.grasp-popover__trigger') || this.querySelector('button');
    this._panel = this.querySelector('.grasp-popover__panel') || this.querySelector('[popover]');
    if (!this._trigger || !this._panel) return;
    if (!this._panel.id) this._panel.id = nextId('grasp-popover');
    this._panel.classList.add('grasp-popover__panel');
    if (!this._panel.hasAttribute('popover')) this._panel.setAttribute('popover', '');
    this._trigger.setAttribute('popovertarget', this._panel.id);
    this._trigger.setAttribute('aria-expanded', 'false');
    // The native Popover API drives show/hide, light-dismiss, Escape, and the
    // top layer; the toggle event lets us reflect state and place the panel.
    this._panel.addEventListener('toggle', (e) => {
      const open = e.newState === 'open';
      this._trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) this._position();
    });
  }
  _position() {
    const r = this._trigger.getBoundingClientRect();
    this._panel.style.position = 'fixed';
    this._panel.style.margin = '0';
    this._panel.style.top = (r.bottom + 6) + 'px';
    this._panel.style.left = r.left + 'px';
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
    'grasp-toolbar': GraspToolbar,
    'grasp-toast-region': GraspToastRegion,
    'grasp-popover': GraspPopover,
  };
  for (const [tag, cls] of Object.entries(defs)) {
    if (!customElements.get(tag)) customElements.define(tag, cls);
  }
}

export { GraspField, GraspModal, GraspMenu, GraspTabs, GraspTooltip, GraspAccordion, GraspCombobox, GraspToolbar, GraspToastRegion, GraspPopover, toast };
