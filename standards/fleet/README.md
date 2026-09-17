# FLEET

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/fleet-overview-dark.svg">
  <img alt="FLEET overview: why it exists (a page can look finished and still be slow and janky, invisible until measured), what it emits (responsive image markup, resource hints and font tags, cache config, and a delivery auditor, against Core Web Vitals), its honest boundary (it emits and audits the markup and config but cannot encode a pixel, bundle a module, or set a header), and how it differs from perf plugins, framework defaults, a score, and nothing." src="assets/fleet-overview-light.svg" width="1200">
</picture>

FLEET is delivery: the markup, head tags, and config that make a shipped page load fast and stable. A page can look finished and still be slow and janky, an oversized hero image that arrives late, content that jumps as images and fonts load, a render blocked behind scripts. That damage is invisible until measured, which is exactly when a fast build skips it. FLEET emits the correct markup and configuration, and audits a page for the misses, against the Core Web Vitals (Largest Contentful Paint, Cumulative Layout Shift, Interaction to Next Paint).

It covers its primitizable delivery set across Tiers 1 to 3: Tier 1, the responsive-image and picture emitter with reserved dimensions and correct scheduling; Tier 2, resource-hint and font head tags plus a cache-header config generator; and Tier 3, a delivery auditor and a Speculation Rules generator. It stays **0.x** until a numbered release is cut.

## What FLEET is, and is not

FLEET is honest about a boundary the other Polymathie primitives do not have. A zero-dependency, native-first primitive can emit correct delivery markup, correct head tags, and correct config text, and it can audit HTML. It cannot compress an image, bundle JavaScript, or set a cache header, because those are build-tool and server work. So FLEET emits the `<img>` and `<picture>` markup that points at your optimized files, generates the cache config your host applies, and audits the result; it does not encode the pixels or ship the bytes. Producing the optimized images and bundles stays with your build; FLEET makes sure the markup and config around them are correct.

## Quickstart

### Any site, no framework

```js
import { img, picture, srcset } from 'fleet-ui'

// The hero (LCP) image: reserved dimensions, eager, high priority, never lazy.
img({
  src: '/hero-1200.jpg',
  alt: 'The product on a desk',
  width: 1200,
  height: 800,
  srcset: srcset('/hero.jpg', [600, 900, 1200]),
  sizes: '(max-width: 700px) 100vw, 1200px',
  priority: true,
})

// An offscreen image: lazy, async decode, dimensions reserved.
img({ src: '/photo.jpg', alt: 'A photo', width: 800, height: 600, lazy: true })

// Format negotiation with a fallback:
picture({
  src: '/photo.jpg', alt: 'A photo', width: 800, height: 600,
  avif: '/photo.avif', webp: '/photo.webp', lazy: true,
})
```

### React

```tsx
import { Img, Picture, srcset } from 'fleet-ui/react'

<Img src="/hero-1200.jpg" alt="The product on a desk" width={1200} height={800}
     srcset={srcset('/hero.jpg', [600, 900, 1200])} sizes="(max-width: 700px) 100vw, 1200px"
     priority />

<Picture src="/photo.jpg" alt="A photo" width={800} height={600} avif="/photo.avif" webp="/photo.webp" lazy />
```

## The LCP image rule

The single most common delivery anti-pattern is lazy-loading the Largest Contentful Paint image, the hero, which delays the very element that defines the metric. FLEET makes the choice explicit: mark the LCP image `priority: true` (eager, `fetchpriority="high"`) and mark offscreen images `lazy: true`. An image that is neither is left at the browser default (eager), which is safe for the LCP image. Always set `width` and `height` so the box is reserved and nothing shifts as the image loads.

## Head tags and cache config

Resource hints, font preloads, and font-face blocks are head and CSS strings; the cache-header generator renders the correct pattern into a named host's config format.

```js
import { hints, preconnect, fontPreload, fontFace, cacheHeaders } from 'fleet-ui'

// Resource hints: preconnect for critical origins, preload for late-discovered assets.
hints([
  { rel: 'preconnect', href: 'https://cdn.example.com', crossorigin: true },
  { rel: 'preload', href: '/app.js', as: 'script' },
])
fontPreload('/fonts/inter.woff2')

// A zero-shift fallback face (the size-adjust value is measured, so you pass it):
fontFace({ family: "'Inter Fallback'", src: 'local("Arial")', display: 'swap', sizeAdjust: '107%' })

// Cache headers: revalidate HTML, cache hashed assets for a year as immutable.
cacheHeaders('netlify')   // or 'vercel', 'nginx'
```

In React, `Hints` renders the link tags (and `fontFace` and `cacheHeaders` are re-exported as the string generators):

```tsx
import { Hints } from 'fleet-ui/react'

<Hints hints={[{ rel: 'preconnect', href: 'https://cdn.example.com', crossorigin: true }]} />
```

The cache config is a build-time file and the font-face is CSS, so neither has a React component; call the generator and write its output.

## Auditing a page

`audit(html)` scans a page's HTML and returns `{ ok, errors, warnings, passed }`, flagging the delivery misses: images without width or height (which cause layout shift), a first image that is lazy-loaded (a likely LCP image delayed), render-blocking scripts in the head, and inline `@font-face` without `font-display`. Delivery issues are advisory, so most land as warnings.

```js
import { audit, speculationRules } from 'fleet-ui'

const report = audit(serverHtmlString)
report.warnings.forEach((w) => console.warn(w.code, w.message))

// Speculation Rules (emerging, Chromium-only; degrades to nothing elsewhere):
speculationRules({ prerender: { where: { href_matches: '/*' }, eagerness: 'moderate' } })
```

Like the other primitives' auditors, this is a lightweight scan of the served markup, not a full performance run; pair it with Lighthouse for field-accurate Core Web Vitals.

## Part of DS4AI, the Design Suite for AI

FLEET is one instrument in **DS4AI, the Design Suite for AI, from [Polymathie-Studio](https://github.com/Polymathie-Studio)**: small, dependency-free pieces that each close one axis of the *invisible-correctness layer*, the part of a shipped surface a look-at-it review cannot see and that fast, AI-assisted building drops.

- **[TEMPER](https://github.com/Polymathie-Studio/temper)**: perceivable, color and design tokens
- **[GRASP](https://github.com/Polymathie-Studio/grasp)**: operable, interaction components
- **[LUCID](https://github.com/Polymathie-Studio/lucid)** + **[GRACE](https://github.com/Polymathie-Studio/grace)**: honest off the happy path, disclosure and state components
- **[HASP](https://github.com/Polymathie-Studio/hasp)**: hardened, client-surface security posture
- **[BEACON](https://github.com/Polymathie-Studio/beacon)**: findable, head metadata and site files
- **[FLEET](https://github.com/Polymathie-Studio/fleet)**: fast and stable, delivery

**[MISSING](https://github.com/Polymathie-Studio/missing)** is the standard at the center of DS4AI: it names the axes, routes each to its instrument, and ships a machine-readable manifest and a conformance auditor. Adopt one and the others compose with it.

## License

Apache-2.0. Copyright 2026 Regis Lloyd Chapman. See `LICENSE` and `NOTICE`.
