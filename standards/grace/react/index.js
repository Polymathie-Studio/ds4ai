'use client'

// GRACE - the React binding. Same classes as the core, no build step.
// Skeleton is a placeholder box; Empty, ErrorState, and NotFound render an
// accessible off-happy-path state. onAction handles retry (or pass href for a
// link). Import 'grace-states/grace.css' for the styles.

import { createElement as h } from 'react'

export function Skeleton({ className = '', ...rest }) {
  return h('span', { className: ('grace-skeleton ' + className).trim(), ...rest })
}

function State({ mod, role, live, heading, message, action, href, onAction, className = '', children }) {
  const kids = []
  if (heading) kids.push(h('p', { className: 'grace-state__title', key: 'h' }, heading))
  if (message) kids.push(h('p', { className: 'grace-state__message', key: 'm' }, message))
  if (children) kids.push(h('div', { key: 'c' }, children))
  if (action) {
    kids.push(
      href
        ? h('a', { className: 'grace-state__action', href, key: 'a' }, action)
        : h('button', { type: 'button', className: 'grace-state__action', onClick: onAction, key: 'a' }, action)
    )
  }
  return h('div', { className: ('grace-state grace-state--' + mod + ' ' + className).trim(), role, 'aria-live': live }, kids)
}

export function Empty(props) {
  return h(State, { mod: 'empty', role: 'status', live: 'polite', ...props })
}
export function ErrorState(props) {
  return h(State, { mod: 'error', role: 'alert', live: 'assertive', ...props })
}
export function NotFound(props) {
  return h(State, { mod: 'notfound', role: 'status', live: 'polite', ...props })
}
