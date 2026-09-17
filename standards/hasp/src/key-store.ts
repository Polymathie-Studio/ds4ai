// The key store. Holds the key in the browser only, never on a server. Default
// is localStorage (persists in this browser); pass 'session' for sessionStorage
// (cleared when the tab closes) when you want the stricter privacy posture.
//
// The store keeps one key per provider, plus the last-used provider, so an app
// can hold, say, an Anthropic and an OpenAI key and switch between them.

import { detectProvider, type ProviderId } from './providers.js'

const PREFIX = 'hasp:key:'
const ACTIVE = 'hasp:active'

export type StoreKind = 'local' | 'session'

function store(kind: StoreKind): Storage | null {
  if (typeof window === 'undefined') return null
  try {
    return kind === 'session' ? window.sessionStorage : window.localStorage
  } catch {
    return null
  }
}

// Hold a key. The provider can be given explicitly (the user's choice wins); if
// it is not, HASP auto-detects it from the key, and if it recognizes nothing it
// holds the key as 'other' rather than guessing a provider. No provider is ever
// privileged as a fallback.
export function setKey(key: string, kind: StoreKind = 'local', provider?: ProviderId): ProviderId | null {
  const s = store(kind)
  const trimmed = key.trim()
  if (!s || !trimmed) return null
  const resolved = provider ?? detectProvider(trimmed) ?? 'other'
  s.setItem(PREFIX + resolved, trimmed)
  s.setItem(ACTIVE, resolved)
  return resolved
}

export function getKey(provider?: ProviderId, kind: StoreKind = 'local'): string | null {
  const s = store(kind)
  if (!s) return null
  const p = provider ?? (s.getItem(ACTIVE) as ProviderId | null)
  if (!p) return null
  return s.getItem(PREFIX + p)
}

export function getActiveProvider(kind: StoreKind = 'local'): ProviderId | null {
  const s = store(kind)
  return (s?.getItem(ACTIVE) as ProviderId | null) ?? null
}

export function clearKey(provider?: ProviderId, kind: StoreKind = 'local'): void {
  const s = store(kind)
  if (!s) return
  if (provider) {
    s.removeItem(PREFIX + provider)
    if (s.getItem(ACTIVE) === provider) s.removeItem(ACTIVE)
  } else {
    const active = s.getItem(ACTIVE)
    if (active) s.removeItem(PREFIX + active)
    s.removeItem(ACTIVE)
  }
}

export function hasKey(provider?: ProviderId, kind: StoreKind = 'local'): boolean {
  return !!getKey(provider, kind)
}
