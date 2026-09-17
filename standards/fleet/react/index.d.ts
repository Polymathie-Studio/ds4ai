import type { ReactElement } from 'react'

export interface ImgData {
  src: string
  alt?: string
  /** Set width and height (or CSS aspect-ratio) to reserve space and prevent layout shift. */
  width?: number | string
  height?: number | string
  srcset?: string
  sizes?: string
  decoding?: 'async' | 'sync' | 'auto'
  /** The LCP image (hero, above the fold): eager and high priority, never lazy. */
  priority?: boolean
  /** Offscreen images: loading="lazy". Never set this on the LCP image. */
  lazy?: boolean
  className?: string
  id?: string
}
export function Img(data: ImgData): ReactElement

export interface SourceSpec {
  srcset: string
  type?: string
  media?: string
  sizes?: string
}
export interface PictureData extends ImgData {
  /** Shortcut for a type="image/avif" source. */
  avif?: string
  /** Shortcut for a type="image/webp" source. */
  webp?: string
  /** Additional sources for art direction or full control. */
  sources?: SourceSpec[]
}
export function Picture(data: PictureData): ReactElement

/** Build a srcset string from a base path and widths, e.g. srcset('photo.jpg', [400, 800]). */
export function srcset(base: string, widths?: number[], name?: (w: number) => string): string

export interface HintSpec {
  rel: 'preconnect' | 'dns-prefetch' | 'preload' | 'modulepreload' | (string & {})
  href: string
  as?: string
  type?: string
  crossorigin?: boolean | string
  fetchpriority?: 'high' | 'low' | 'auto'
}
export interface HintsProps { hints: HintSpec[] }
/** Render resource-hint link tags. React 19 hoists them to <head>. */
export function Hints(props: HintsProps): ReactElement

export interface FontFaceData {
  family: string
  src?: string
  display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional'
  weight?: string | number
  style?: string
  sizeAdjust?: string
  ascentOverride?: string
  descentOverride?: string
  lineGapOverride?: string
}
/** Build an @font-face CSS block (returned as CSS text). */
export function fontFace(data: FontFaceData): string

export type CacheTarget = 'netlify' | 'vercel' | 'nginx'
export interface CacheOptions {
  assetGlob?: string
  immutable?: string
  html?: string
  assetExt?: string
}
/** Generate cache-header config for a named host (returned as config text). */
export function cacheHeaders(target?: CacheTarget, opts?: CacheOptions): string

export interface SpeculationRulesProps {
  prefetch?: object | object[]
  prerender?: object | object[]
}
/** Render a Speculation Rules script. Emerging and Chromium-only; degrades to nothing elsewhere. */
export function SpeculationRules(props: SpeculationRulesProps): ReactElement
