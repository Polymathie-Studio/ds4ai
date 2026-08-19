'use client'

// GRASP - the React binding. Same classes and behavior as the core, no build
// step. Button, Field, Modal (native <dialog>), and Menu. Import
// 'grasp-ui/grasp.css' for the styles.

import { createElement as h, useId, useRef, useEffect, useState, cloneElement, Children } from 'react'

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
