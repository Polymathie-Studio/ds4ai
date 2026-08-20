'use client'

// GRASP - the React binding. Same classes and behavior as the core, no build
// step. Button, Field, Modal (native <dialog>), and Menu. Import
// 'grasp-ui/grasp.css' for the styles.

import { createElement as h, useId, useRef, useEffect, useState, cloneElement, Children } from 'react'

// Tier 3 native/CSS controls live at the end of this file: Slider, Spinbutton,
// Progress, Meter, Breadcrumb, ToggleGroup. Each builds on a native element.

export function Button({ variant, className = '', ...rest }) {
  const cls = ['grasp-button', variant ? 'grasp-button--' + variant : '', className].filter(Boolean).join(' ')
  return h('button', { className: cls, ...rest })
}

export function Checkbox({ className = '', ...rest }) {
  return h('input', { type: 'checkbox', className: ('grasp-checkbox ' + className).trim(), ...rest })
}

export function Radio({ className = '', ...rest }) {
  return h('input', { type: 'radio', className: ('grasp-radio ' + className).trim(), ...rest })
}

export function Switch({ className = '', ...rest }) {
  return h('input', { type: 'checkbox', role: 'switch', className: ('grasp-switch ' + className).trim(), ...rest })
}

export function Select({ className = '', children, ...rest }) {
  return h('select', { className: ('grasp-select ' + className).trim(), ...rest }, children)
}

export function Field({ label, hint, error, children }) {
  const rid = useId()
  const control = Children.only(children)
  const controlId = control.props.id || rid + '-control'
  const hintId = hint ? rid + '-hint' : undefined
  const errorId = error ? rid + '-error' : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined
  const wired = cloneElement(control, {
    id: controlId,
    'aria-describedby': describedBy,
    'aria-invalid': error ? true : undefined,
  })
  return h('div', { className: 'grasp-field' },
    label
      ? h('label', { className: 'grasp-field__label', htmlFor: controlId, key: 'l' },
          label,
          control.props.required ? h('span', { className: 'grasp-field__req', 'aria-hidden': true, key: 'r' }, ' *') : null)
      : null,
    wired,
    hint ? h('p', { className: 'grasp-field__hint', id: hintId, key: 'h' }, hint) : null,
    error ? h('p', { className: 'grasp-field__error', id: errorId, key: 'e' }, error) : null,
  )
}

export function Modal({ open, onClose, heading, children }) {
  const ref = useRef(null)
  const titleId = useId()
  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) d.showModal()
    else if (!open && d.open) d.close()
  }, [open])
  useEffect(() => {
    const d = ref.current
    if (!d) return
    const onNativeClose = () => onClose && onClose()
    const onClick = (e) => { if (e.target === d) d.close() }
    d.addEventListener('close', onNativeClose)
    d.addEventListener('click', onClick)
    return () => { d.removeEventListener('close', onNativeClose); d.removeEventListener('click', onClick) }
  }, [onClose])
  return h('dialog', { ref, className: 'grasp-modal', 'aria-labelledby': heading ? titleId : undefined },
    heading ? h('h2', { className: 'grasp-modal__title', id: titleId, key: 't' }, heading) : null,
    children,
  )
}

export function Menu({ label, items = [], triggerVariant = 'secondary', className = '' }) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(-1)
  const rootRef = useRef(null)
  const triggerRef = useRef(null)
  const itemRefs = useRef([])

  useEffect(() => {
    if (open && index >= 0 && itemRefs.current[index]) itemRefs.current[index].focus()
  }, [open, index])

  useEffect(() => {
    if (!open) return
    const onDoc = (e) => { if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false) }
    document.addEventListener('click', onDoc, true)
    return () => document.removeEventListener('click', onDoc, true)
  }, [open])

  const openTo = (i) => { setOpen(true); setIndex(i) }
  const move = (delta) => setIndex((n) => (n + delta + items.length) % items.length)
  const close = () => { setOpen(false); setIndex(-1) }

  const onTriggerKey = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openTo(0) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); openTo(items.length - 1) }
  }
  const onListKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); move(1) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1) }
    else if (e.key === 'Home') { e.preventDefault(); setIndex(0) }
    else if (e.key === 'End') { e.preventDefault(); setIndex(items.length - 1) }
    else if (e.key === 'Escape') { e.preventDefault(); close(); triggerRef.current && triggerRef.current.focus() }
    else if (e.key === 'Tab') setOpen(false)
  }

  return h('div', { className: ('grasp-menu ' + className).trim(), ref: rootRef, ...(open ? { open: '' } : {}) },
    h('button', {
      ref: triggerRef,
      type: 'button',
      className: 'grasp-menu__trigger grasp-button grasp-button--' + triggerVariant,
      'aria-haspopup': 'menu',
      'aria-expanded': open,
      onClick: () => (open ? close() : openTo(-1)),
      onKeyDown: onTriggerKey,
    }, label),
    h('div', { className: 'grasp-menu__list', role: 'menu', onKeyDown: onListKey },
      items.map((it, i) =>
        h(it.href ? 'a' : 'button', {
          key: i,
          ref: (el) => { itemRefs.current[i] = el },
          className: 'grasp-menu__item',
          role: 'menuitem',
          tabIndex: -1,
          ...(it.href ? { href: it.href } : { type: 'button' }),
          onClick: () => { it.onSelect && it.onSelect(); close() },
        }, it.label)
      ),
    ),
  )
}

export function Tabs({ tabs = [] }) {
  const [i, setI] = useState(0)
  const refs = useRef([])
  const base = useId()
  const onKey = (e) => {
    const n = tabs.length
    let next = null
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % n
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + n) % n
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = n - 1
    if (next !== null) { e.preventDefault(); setI(next); if (refs.current[next]) refs.current[next].focus() }
  }
  return h('div', { className: 'grasp-tabs' },
    h('div', { className: 'grasp-tabs__list', role: 'tablist', onKeyDown: onKey },
      tabs.map((t, j) => h('button', {
        key: j,
        ref: (el) => { refs.current[j] = el },
        className: 'grasp-tabs__tab',
        role: 'tab',
        id: base + '-t' + j,
        'aria-selected': j === i,
        'aria-controls': base + '-p' + j,
        tabIndex: j === i ? 0 : -1,
        onClick: () => setI(j),
      }, t.label))),
    tabs.map((t, j) => h('div', {
      key: j,
      className: 'grasp-tabs__panel',
      role: 'tabpanel',
      id: base + '-p' + j,
      'aria-labelledby': base + '-t' + j,
      hidden: j !== i,
      tabIndex: 0,
    }, t.content)),
  )
}

export function Tooltip({ text, children }) {
  const [show, setShow] = useState(false)
  const id = useId()
  const trigger = cloneElement(Children.only(children), {
    'aria-describedby': id,
    onMouseEnter: () => setShow(true),
    onMouseLeave: () => setShow(false),
    onFocus: () => setShow(true),
    onBlur: () => setShow(false),
    onKeyDown: (e) => { if (e.key === 'Escape') setShow(false) },
  })
  return h('span', { className: 'grasp-tooltip' },
    trigger,
    h('span', { className: 'grasp-tooltip__bubble', role: 'tooltip', id, hidden: !show, key: 'b' }, text),
  )
}

export function Accordion({ items = [], single = false }) {
  const [openSet, setOpenSet] = useState(() => new Set())
  const base = useId()
  const toggle = (j) => setOpenSet((prev) => {
    const isOpen = prev.has(j)
    if (single) return isOpen ? new Set() : new Set([j])
    const next = new Set(prev)
    if (isOpen) next.delete(j); else next.add(j)
    return next
  })
  return h('div', { className: 'grasp-accordion' },
    items.flatMap((it, j) => {
      const open = openSet.has(j)
      return [
        h('button', { key: 'h' + j, className: 'grasp-accordion__header', id: base + '-h' + j, 'aria-expanded': open, 'aria-controls': base + '-p' + j, onClick: () => toggle(j) }, it.header),
        h('div', { key: 'p' + j, className: 'grasp-accordion__panel', id: base + '-p' + j, role: 'region', 'aria-labelledby': base + '-h' + j, hidden: !open }, it.content),
      ]
    }),
  )
}

export function Combobox({ options = [], placeholder, onSelect, className = '' }) {
  const [value, setValue] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const rootRef = useRef(null)
  const inputRef = useRef(null)
  const base = useId()
  const norm = options.map((o) => (typeof o === 'string' ? { label: o, value: o } : o))
  const q = value.trim().toLowerCase()
  const filtered = q ? norm.filter((o) => o.label.toLowerCase().includes(q)) : norm

  useEffect(() => {
    if (!open) return
    const onDoc = (e) => { if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false) }
    document.addEventListener('click', onDoc, true)
    return () => document.removeEventListener('click', onDoc, true)
  }, [open])

  const choose = (o) => { setValue(o.label); setOpen(false); setActive(-1); if (onSelect) onSelect(o.value); if (inputRef.current) inputRef.current.focus() }
  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setActive((a) => Math.min(a + 1, filtered.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)) }
    else if (e.key === 'Enter') { if (open && active >= 0 && filtered[active]) { e.preventDefault(); choose(filtered[active]) } }
    else if (e.key === 'Escape') { setOpen(false); setActive(-1) }
  }
  const isOpen = open && filtered.length > 0
  const activeId = isOpen && active >= 0 && filtered[active] ? base + '-o' + active : undefined

  return h('div', { className: ('grasp-combobox ' + className).trim(), ref: rootRef, ...(isOpen ? { open: '' } : {}) },
    h('input', {
      ref: inputRef,
      type: 'text',
      placeholder,
      value,
      role: 'combobox',
      'aria-expanded': isOpen,
      'aria-controls': base + '-list',
      'aria-autocomplete': 'list',
      'aria-activedescendant': activeId,
      autoComplete: 'off',
      onChange: (e) => { setValue(e.target.value); setOpen(true); setActive(-1) },
      onKeyDown: onKey,
      onFocus: () => { if (value) setOpen(true) },
    }),
    h('div', { className: 'grasp-combobox__list', role: 'listbox', id: base + '-list' },
      filtered.map((o, i) => h('div', {
        key: i,
        id: base + '-o' + i,
        role: 'option',
        className: 'grasp-combobox__option',
        'aria-selected': i === active,
        onClick: () => choose(o),
      }, o.label)),
    ),
  )
}

// --- Tier 3: native/CSS controls. Each is a themed native element. ---

export function Slider({ className = '', ...rest }) {
  return h('input', { type: 'range', className: ('grasp-slider ' + className).trim(), ...rest })
}

export function Spinbutton({ className = '', ...rest }) {
  return h('input', { type: 'number', className: ('grasp-spinbutton ' + className).trim(), ...rest })
}

export function Progress({ className = '', ...rest }) {
  return h('progress', { className: ('grasp-progress ' + className).trim(), ...rest })
}

export function Meter({ className = '', ...rest }) {
  return h('meter', { className: ('grasp-meter ' + className).trim(), ...rest })
}

export function Breadcrumb({ items = [], label = 'Breadcrumb', className = '' }) {
  return h('nav', { className: ('grasp-breadcrumb ' + className).trim(), 'aria-label': label },
    h('ol', null,
      items.map((it, i) => {
        const last = i === items.length - 1
        return h('li', { key: i },
          !last && it.href
            ? h('a', { href: it.href }, it.label)
            : h('span', { 'aria-current': last ? 'page' : undefined }, it.label)
        )
      }),
    ),
  )
}

export function ToggleGroup({ options = [], name, value, defaultValue, multiple = false, onChange, label, className = '' }) {
  const rid = useId()
  const groupName = name || rid
  const isOn = (v, ov) => (multiple ? Array.isArray(v) && v.includes(ov) : v === ov)
  const controlled = value !== undefined
  return h('div', { className: ('grasp-toggle-group ' + className).trim(), role: 'group', 'aria-label': label },
    options.map((o, i) => {
      const opt = typeof o === 'string' ? { label: o, value: o } : o
      const input = {
        className: 'grasp-toggle-group__input',
        type: multiple ? 'checkbox' : 'radio',
        value: opt.value,
        onChange,
      }
      if (!multiple) input.name = groupName
      if (controlled) input.checked = isOn(value, opt.value)
      else input.defaultChecked = isOn(defaultValue, opt.value)
      return h('label', { key: i, className: 'grasp-toggle-group__option' },
        h('input', input),
        h('span', { className: 'grasp-toggle-group__label' }, opt.label),
      )
    }),
  )
}

// --- Tier 3 widgets: Toolbar, Toast, Popover ---

const TOOLBAR_ITEMS = 'button, a[href], [role="button"]'

export function Toolbar({ children, orientation, label, className = '' }) {
  const ref = useRef(null)
  const vertical = orientation === 'vertical'
  useEffect(() => {
    const items = ref.current ? Array.from(ref.current.querySelectorAll(TOOLBAR_ITEMS)) : []
    items.forEach((it, i) => { it.tabIndex = i === 0 ? 0 : -1 })
  }, [])
  const onKeyDown = (e) => {
    const items = ref.current ? Array.from(ref.current.querySelectorAll(TOOLBAR_ITEMS)) : []
    if (!items.length) return
    const cur = items.indexOf(document.activeElement)
    const next = vertical ? 'ArrowDown' : 'ArrowRight'
    const prev = vertical ? 'ArrowUp' : 'ArrowLeft'
    let to = null
    if (e.key === next) to = (cur + 1) % items.length
    else if (e.key === prev) to = (cur - 1 + items.length) % items.length
    else if (e.key === 'Home') to = 0
    else if (e.key === 'End') to = items.length - 1
    if (to !== null) {
      e.preventDefault()
      items.forEach((it, i) => { it.tabIndex = i === to ? 0 : -1 })
      items[to].focus()
    }
  }
  return h('div', {
    ref,
    className: ('grasp-toolbar ' + className).trim(),
    role: 'toolbar',
    'aria-label': label,
    'aria-orientation': vertical ? 'vertical' : undefined,
    onKeyDown,
  }, children)
}

// Controlled: the app owns the toasts array and dismissal (timing included).
export function Toast({ toasts = [], onDismiss, assertive = false, label = 'Notifications', className = '' }) {
  return h('div', {
    className: ('grasp-toast-region ' + className).trim(),
    role: 'region',
    'aria-label': label,
    'aria-live': assertive ? 'assertive' : 'polite',
    'aria-atomic': 'false',
  },
    toasts.map((t) => {
      const item = typeof t === 'string' ? { id: t, message: t } : t
      return h('div', {
        key: item.id,
        className: 'grasp-toast' + (item.variant ? ' grasp-toast--' + item.variant : ''),
        role: item.assertive ? 'alert' : 'status',
      },
        h('span', { className: 'grasp-toast__text', key: 't' }, item.message),
        onDismiss ? h('button', {
          key: 'x',
          type: 'button',
          className: 'grasp-toast__close',
          'aria-label': 'Dismiss',
          onClick: () => onDismiss(item.id),
        }, '×') : null,
      )
    }),
  )
}

export function Popover({ trigger, triggerVariant = 'secondary', children, className = '' }) {
  const id = useId()
  const panelRef = useRef(null)
  const triggerRef = useRef(null)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return
    const onToggle = (e) => {
      const isOpen = e.newState === 'open'
      setOpen(isOpen)
      if (isOpen && triggerRef.current) {
        const r = triggerRef.current.getBoundingClientRect()
        panel.style.position = 'fixed'
        panel.style.margin = '0'
        panel.style.top = (r.bottom + 6) + 'px'
        panel.style.left = r.left + 'px'
      }
    }
    panel.addEventListener('toggle', onToggle)
    return () => panel.removeEventListener('toggle', onToggle)
  }, [])
  return h('span', { className: ('grasp-popover ' + className).trim() },
    h('button', {
      ref: triggerRef,
      type: 'button',
      className: 'grasp-popover__trigger grasp-button grasp-button--' + triggerVariant,
      popoverTarget: id,
      'aria-expanded': open,
    }, trigger),
    h('div', { ref: panelRef, id, popover: '', className: 'grasp-popover__panel' }, children),
  )
}
