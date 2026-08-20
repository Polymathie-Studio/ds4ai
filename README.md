# HASP

**Hold Any-provider Secrets Privately.** Bring your own key.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/hasp-render-dark.png">
  <img alt="HASP rendering its bring-your-own-key modal over an app: a key entered, the provider auto-detected as Claude, and links to get a key, with the key held only in the browser." src="assets/hasp-render-light.png" width="820">
</picture>

HASP is a small, dependency-free holder for AI API keys. A tool that uses it runs on the user's own key: the key is kept in the user's browser, never on a server, and the charges land on the user's own account. It auto-detects the provider from the key, so one entry field handles Anthropic, OpenAI, Google, xAI, and Mistral, and any other key is held as `other` rather than mislabeled, so the name is literally true: it holds any provider's secret. The user, or the app, can also set the provider explicitly.

It exists so apps stop rebuilding the same "paste your key" plumbing, and so the privacy posture (the key never leaves the browser) is the same everywhere.

## Why

Most small AI tools face the same fork: pay for every user's model calls out of a shared server key, or make each user bring their own. Bring-your-own-key is the honest default for a free tool, but the plumbing (a modal, storage, provider detection, the privacy promise) gets rewritten every time. HASP is that plumbing, once.

## Install

```
npm install hasp-key
```

The package name is `hasp-key`; it is planned for npm but not yet published. Until then, use it from the repository.

React is an optional peer dependency, needed only for the modal and the hook.

## Core (no framework)

```ts
import { setKey, getKey, clearKey, detectProvider } from 'hasp-key'

setKey('sk-ant-...')          // stored in this browser only; provider auto-detected
const key = getKey()           // read it at call time
detectProvider('sk-ant-...')   // 'anthropic'
clearKey()                     // forget it
```

Keys live in `localStorage` by default (persists in the browser). Pass `'session'` as the `kind` argument for `sessionStorage`, which clears when the tab closes, when you want the stricter posture.

## React

```tsx
import { useHaspKey, KeyModal } from 'hasp-key/react'

function AssistButton() {
  const { present, read } = useHaspKey()
  const [open, setOpen] = useState(false)
  // send read() with your own request; never persist it elsewhere
  return present
    ? <button onClick={runWithKey}>Ask</button>
    : <button onClick={() => setOpen(true)}>Add your key</button>
    // ...render <KeyModal onClose={() => setOpen(false)} /> when open
}
```

`KeyModal` is lightly styled and takes `className` and `inputClassName` so it inherits your app's theme. Its default styling reads TEMPER's semantic tokens with fallbacks, so where TEMPER is present the modal follows the active theme, and where it is absent it renders a clean neutral panel.

## The privacy model

The key is held only in the browser. HASP never sends it anywhere. Your app decides how the key reaches the model: either the browser calls the provider directly (the key never touches any server), or the browser sends the key with a request to your own route which forwards it and does not store or log it. HASP takes no position beyond keeping the key local; it is your app's job to honor the promise on the wire.

## Part of DS4AI, the Design Suite for AI

HASP is one instrument in **DS4AI, the Design Suite for AI, from [Polymathie-Studio](https://github.com/Polymathie-Studio)**: small, dependency-free pieces that each close one axis of the *invisible-correctness layer*, the part of a shipped surface a look-at-it review cannot see and that fast, AI-assisted building drops.

- **[TEMPER](https://github.com/Polymathie-Studio/temper)**: perceivable, color and design tokens
- **[GRASP](https://github.com/Polymathie-Studio/grasp)**: operable, interaction components
- **[LUCID](https://github.com/Polymathie-Studio/lucid)** + **[GRACE](https://github.com/Polymathie-Studio/grace)**: honest off the happy path, disclosure and state components
- **[HASP](https://github.com/Polymathie-Studio/hasp)**: key privacy, bring-your-own-key
- **[BEACON](https://github.com/Polymathie-Studio/beacon)**: findable, head metadata and site files
- **[FLEET](https://github.com/Polymathie-Studio/fleet)**: fast and stable, delivery

**[MISSING](https://github.com/Polymathie-Studio/missing)** is the standard at the center of DS4AI: it names the axes, routes each to its instrument, and ships a machine-readable manifest and a conformance auditor. Adopt one and the others compose with it.

## License

Apache-2.0. Copyright 2026 Regis Lloyd Chapman. See `LICENSE` and `NOTICE`.
