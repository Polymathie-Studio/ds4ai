'use client'

// GRASP - the React binding. Same classes and behavior as the core, no build
// step. Button, Field, Modal (native <dialog>), and Menu. Import
// 'grasp-ui/grasp.css' for the styles.

import { createElement as h, useId, useRef, useEffect, useState, cloneElement, Children } from 'react'

export function Button({ variant, className = '', ...rest }) {
  const cls = ['grasp-button', variant ? 'grasp-button--' + variant : '', className].filter(Boolean).join(' ')
  return h('button', { className: cls, ...rest })
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
