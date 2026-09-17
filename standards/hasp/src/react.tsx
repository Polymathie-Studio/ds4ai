'use client'

// The React layer: a hook and a key modal. Unstyled enough to drop into any app;
// pass className props to theme it. Everything here is browser-only.

import { useCallback, useEffect, useState } from 'react'
import { PROVIDERS, detectProvider, type ProviderId } from './providers.js'
import { getKey, setKey, clearKey, getActiveProvider, type StoreKind } from './key-store.js'

export function useHaspKey(kind: StoreKind = 'local') {
  const [provider, setProvider] = useState<ProviderId | null>(null)
  const [present, setPresent] = useState(false)

  const refresh = useCallback(() => {
    const p = getActiveProvider(kind)
    setProvider(p)
    setPresent(!!getKey(p ?? undefined, kind))
  }, [kind])

  useEffect(() => { refresh() }, [refresh])

  const save = useCallback((key: string, provider?: ProviderId) => {
    const p = setKey(key, kind, provider)
    refresh()
    return p
  }, [kind, refresh])

  const clear = useCallback(() => { clearKey(undefined, kind); refresh() }, [kind, refresh])

  // Returns the stored key for use at call time. Prefer sending this only to your
  // own request, never persisting it anywhere else.
  const read = useCallback(() => getKey(provider ?? undefined, kind), [provider, kind])

  return { provider, present, save, clear, read, refresh }
}

type ModalProps = {
  onClose: () => void
  kind?: StoreKind
  className?: string
  inputClassName?: string
}

export function KeyModal({ onClose, kind = 'local', className, inputClassName }: ModalProps) {
  const [value, setValue] = useState('')
  const [chosen, setChosen] = useState<ProviderId | ''>('')
  const [saved, setSaved] = useState(false)
  const detected = detectProvider(value)
  // The provider actually held: the user's explicit choice wins, else the
  // auto-detected one, else 'other'. Never a privileged guess.
  const provider: ProviderId = chosen || detected || 'other'

  // Load the stored key and the provider it was stored under, so reopening the
  // modal shows the provider actually held (a Mistral or "Other" key that has no
  // detectable prefix keeps its label) rather than falling back to a guess.
  useEffect(() => {
    setValue(getKey(undefined, kind) ?? '')
    setChosen(getActiveProvider(kind) ?? '')
  }, [kind])

  function save() {
    const t = value.trim()
    if (t) setKey(t, kind, provider)
    else clearKey(undefined, kind)
    setSaved(true)
    setTimeout(onClose, 700)
  }

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      style={{ position: 'fixed', inset: 0, zIndex: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-overlay, rgba(0,0,0,0.6))', backdropFilter: 'blur(2px)' }}
    >
      <div className={className} style={className ? undefined : { background: 'var(--color-surface, #111)', border: '1px solid var(--color-border, #333)', borderRadius: 10, padding: '1.5rem', width: 480, maxWidth: 'calc(100vw - 2rem)', color: 'var(--color-text-primary, #eee)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.6 }}>Your key</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Bring your own key</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: 18, opacity: 0.6 }}>×</button>
        </div>

        <p style={{ fontSize: 12, opacity: 0.7, lineHeight: 1.6, marginBottom: '0.75rem' }}>
          This runs on your own key, and the charges go to your account. The key is held only in this browser{kind === 'session' ? ' tab, and cleared when you close it' : ''}. It is never stored on our servers.
        </p>

        <input
          type="password"
          value={value}
          onChange={(e) => { setValue(e.target.value); setChosen(''); setSaved(false) }}
          placeholder="sk-ant-... or sk-... or AIza..."
          className={inputClassName}
          style={inputClassName ? undefined : { width: '100%', background: 'var(--color-bg-subtle, #1a1a1a)', border: '1px solid var(--color-border, #333)', borderRadius: 6, color: 'var(--color-text-primary, #eee)', fontSize: 13, padding: '0.5rem 0.75rem', boxSizing: 'border-box', fontFamily: 'monospace' }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, opacity: 0.7, marginTop: 6, minHeight: 24 }}>
          {value.trim() && (
            <>
              <label htmlFor="hasp-provider">Provider</label>
              <select
                id="hasp-provider"
                value={provider}
                onChange={(e) => setChosen(e.target.value as ProviderId)}
                style={{ background: 'var(--color-bg-subtle, #1a1a1a)', border: '1px solid var(--color-border, #333)', borderRadius: 6, color: 'var(--color-text-primary, #eee)', fontSize: 12, padding: '0.2rem 0.4rem' }}
              >
                {PROVIDERS.map((p) => (
                  <option key={p.id} value={p.id}>{p.short}</option>
                ))}
              </select>
              {detected && !chosen && <span style={{ opacity: 0.6 }}>detected from key</span>}
            </>
          )}
          {saved && <span style={{ marginLeft: 'auto' }}>Saved.</span>}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
          <button onClick={() => { clearKey(undefined, kind); setValue('') }} style={{ padding: '0.4rem 0.9rem', background: 'none', border: '1px solid var(--color-border, #333)', borderRadius: 6, color: 'inherit', fontSize: 12, cursor: 'pointer', opacity: 0.7 }}>Clear key</button>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={onClose} style={{ padding: '0.4rem 1rem', background: 'none', border: '1px solid var(--color-border, #333)', borderRadius: 6, color: 'inherit', fontSize: 12, cursor: 'pointer', opacity: 0.7 }}>Cancel</button>
            <button onClick={save} style={{ padding: '0.4rem 1rem', background: 'var(--color-accent-solid, #eee)', border: 'none', borderRadius: 6, color: 'var(--color-text-on-accent, #000)', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Save</button>
          </div>
        </div>

        <div style={{ fontSize: 11, opacity: 0.5, marginTop: '0.75rem' }}>
          Need a key? {PROVIDERS.filter((p) => p.keyUrl).map((p, i) => (
            <span key={p.id}>{i > 0 ? ' · ' : ''}<a href={p.keyUrl} target="_blank" rel="noreferrer" style={{ color: 'inherit' }}>{p.short}</a></span>
          ))}
        </div>
      </div>
    </div>
  )
}
