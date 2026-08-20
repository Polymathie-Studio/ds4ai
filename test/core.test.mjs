// Regression suite for the HASP core (the browser-only key store and provider
// auto-detect). Runs on Node's built-in test runner with a Map-backed Storage shim,
// so no browser or extra dependency is needed: `node --test`.
//
// It pins the behaviors the "any-provider" revision established: an unrecognized key
// is held as 'other' and never mislabeled, an explicit provider beats detection, the
// stored provider is what a reopen reads back, prefix order keeps sk-ant- from being
// read as OpenAI, and local and session stores stay independent.

import { test, beforeEach } from 'node:test'
import assert from 'node:assert/strict'

// Minimal Storage shim (getItem/setItem/removeItem is all the store uses).
class MemStorage {
  constructor() { this.m = new Map() }
  getItem(k) { return this.m.has(k) ? this.m.get(k) : null }
  setItem(k, v) { this.m.set(String(k), String(v)) }
  removeItem(k) { this.m.delete(k) }
  clear() { this.m.clear() }
}
const localStorage = new MemStorage()
const sessionStorage = new MemStorage()
globalThis.window = { localStorage, sessionStorage }

const {
  detectProvider, getProvider, PROVIDERS,
  setKey, getKey, getActiveProvider, clearKey, hasKey,
} = await import('../dist/index.js')

beforeEach(() => { localStorage.clear(); sessionStorage.clear() })

// --- detectProvider ---------------------------------------------------------

test('detectProvider: sk-ant- is Anthropic, not OpenAI (prefix order)', () => {
  assert.equal(detectProvider('sk-ant-abc123'), 'anthropic')
})

test('detectProvider: plain sk- is OpenAI', () => {
  assert.equal(detectProvider('sk-abc123'), 'openai')
})

test('detectProvider: recognizes Google and xAI prefixes', () => {
  assert.equal(detectProvider('AIzaSyABC123'), 'google')
  assert.equal(detectProvider('xai-abc123'), 'xai')
})

test('detectProvider: unrecognized key returns null (never guessed)', () => {
  assert.equal(detectProvider('mistral-no-prefix'), null)
  assert.equal(detectProvider('totally-unknown'), null)
})

test('detectProvider: trims before matching', () => {
  assert.equal(detectProvider('   sk-ant-x  '), 'anthropic')
})

test('getProvider: every ProviderId resolves; other has no prefix', () => {
  for (const p of PROVIDERS) assert.equal(getProvider(p.id)?.id, p.id)
  assert.equal(getProvider('other')?.prefix, null)
})

// --- setKey: the any-provider revision --------------------------------------

test('setKey: detected key resolves and stores under its provider', () => {
  assert.equal(setKey('sk-ant-x'), 'anthropic')
  assert.equal(getActiveProvider(), 'anthropic')
  assert.equal(getKey(), 'sk-ant-x')
})

test('setKey: unrecognized key is held as "other", never anthropic', () => {
  assert.equal(setKey('zzz-unknown-key'), 'other')
  assert.equal(getActiveProvider(), 'other')
  assert.equal(getKey(), 'zzz-unknown-key')
  assert.equal(getKey('anthropic'), null) // was NOT mislabeled
})

test('setKey: an explicit provider beats detection', () => {
  // A key that would detect as anthropic, but the app/user names it openai.
  assert.equal(setKey('sk-ant-x', 'local', 'openai'), 'openai')
  assert.equal(getKey('openai'), 'sk-ant-x')
  assert.equal(getActiveProvider(), 'openai')
  assert.equal(getKey('anthropic'), null) // detection did not also store it
})

test('setKey: trims the key before holding it', () => {
  setKey('  sk-ant-y  ')
  assert.equal(getKey('anthropic'), 'sk-ant-y')
})

test('setKey: empty or whitespace-only key is a no-op returning null', () => {
  assert.equal(setKey(''), null)
  assert.equal(setKey('   '), null)
  assert.equal(getActiveProvider(), null)
})

// --- multi-provider hold + active pointer -----------------------------------

test('holds one key per provider and tracks the last-used as active', () => {
  setKey('sk-ant-a')
  setKey('sk-openaikey') // plain sk- => openai
  assert.equal(getKey('anthropic'), 'sk-ant-a')
  assert.equal(getKey('openai'), 'sk-openaikey')
  assert.equal(getActiveProvider(), 'openai')
  assert.equal(getKey(), 'sk-openaikey') // no arg => active provider's key
})

// --- local vs session isolation ---------------------------------------------

test('local and session stores are independent', () => {
  setKey('sk-ant-local', 'local')
  setKey('sk-ant-session', 'session')
  assert.equal(getKey(undefined, 'local'), 'sk-ant-local')
  assert.equal(getKey(undefined, 'session'), 'sk-ant-session')
  assert.equal(getKey('anthropic', 'local'), 'sk-ant-local')
  assert.equal(getKey('anthropic', 'session'), 'sk-ant-session')
})

// --- clearKey ---------------------------------------------------------------

test('clearKey(provider) removes just that key and clears active only if it was active', () => {
  setKey('sk-ant-a')       // active = anthropic
  setKey('sk-openaikey')   // active = openai
  clearKey('anthropic')    // clearing a non-active provider
  assert.equal(hasKey('anthropic'), false)
  assert.equal(getKey('openai'), 'sk-openaikey')
  assert.equal(getActiveProvider(), 'openai') // untouched

  setKey('sk-ant-b')       // active = anthropic again
  clearKey('anthropic')    // clearing the active provider
  assert.equal(getActiveProvider(), null)
})

test('clearKey() with no argument clears the active key and pointer', () => {
  setKey('sk-ant-a')
  clearKey()
  assert.equal(getActiveProvider(), null)
  assert.equal(hasKey('anthropic'), false)
  assert.equal(getKey(), null)
})

// --- hasKey / getKey edges --------------------------------------------------

test('hasKey reflects presence, per provider and overall', () => {
  assert.equal(hasKey(), false)
  setKey('sk-ant-a')
  assert.equal(hasKey(), true)
  assert.equal(hasKey('anthropic'), true)
  assert.equal(hasKey('openai'), false)
})

test('getKey for a provider with no stored key returns null', () => {
  setKey('sk-ant-a')
  assert.equal(getKey('google'), null)
})

// --- SSR / no-window safety -------------------------------------------------

test('no window (SSR): every store op is a safe null no-op', () => {
  const saved = globalThis.window
  globalThis.window = undefined
  try {
    assert.equal(setKey('sk-ant-x'), null)
    assert.equal(getKey(), null)
    assert.equal(getActiveProvider(), null)
    assert.equal(hasKey(), false)
    assert.doesNotThrow(() => clearKey())
  } finally {
    globalThis.window = saved
  }
})
