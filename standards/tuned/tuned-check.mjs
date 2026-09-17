#!/usr/bin/env node
// tuned-check: the mechanical, bias-proof layer of TUNED.
//
// It measures a piece of prose against the median-pull bands and reports where
// the text leaves a band. It runs on counts, not on the model's judgment, which
// is the whole point: the model cannot grade its own pulls, but a counter can.
//
// The bands below are the configuration. They are set from the researched
// base-pull factors (the median-pull inventory v0.3.0 and the claude-opus-4-8
// profile), not from any runtime judgment. Change them here, from the research,
// never from a live read of a draft.
//
// Usage:
//   node tuned-check.mjs <file>            human-readable report
//   node tuned-check.mjs <file> --json     machine-readable record
//   cat file | node tuned-check.mjs        read from stdin
//
// Exit code is 0 when every band holds, 1 when any ceiling or floor is breached.
// The phrase-lock list is review-only (mechanical detect, human decides whether a
// repeat is a necessary term or a lazy one) and never sets the exit code.

import { readFileSync } from 'node:fs'

// --- The bands (the researched configuration) -------------------------------

const BANDS = {
  emDash:            { ceiling: 0 },                 // standing hard rule
  hardFillerPer1k:   { ceiling: 0 },                 // the banlist words are never in-band
  aiMarkerPer1k:     { ceiling: 1.5 },               // documented excess-vocabulary class, density
  singleOpenerPct:   { ceiling: 12 },                // profile: "The" opened 16% of sentences
  topOpenersPct:     { ceiling: 32, topN: 6 },       // profile: top-6 openers were 38.6%
  antithesisPer1k:   { ceiling: 1.5 },               // profile: the not-family ran ~1.2/1k, already high
  ratherThanPer1k:   { ceiling: 2.0 },               // corpus: clean human max 1.77 (Timber); model output 3.6
  copulaInflPer1k:   { ceiling: 1.5 },               // "serves as" / "stands as" for plain is/are
  shortSentencePct:  { floor: 6 },                   // some sentences under 8 words should exist
  phraseLockRepeat:  { ceiling: 2 },                 // a non-stopword 2-4gram past this is flagged for review
}

// The banlist: never in-band (CLAUDE.md hard rules plus the closest AI filler).
const HARD_FILLER = [
  'genuinely', 'honestly', 'straightforward', "it's worth noting", 'importantly',
  "it's important to note", 'needless to say', 'of course', 'certainly', 'absolutely',
  "i'd be happy to", 'great question', 'fascinating',
]

// The documented excess-vocabulary class: a density check, not a ban.
const AI_MARKERS = [
  'delve', 'delves', 'tapestry', 'testament', 'crucial', 'pivotal', 'intricate',
  'meticulous', 'robust', 'vibrant', 'landscape', 'underscore', 'underscores',
  'showcasing', 'seamless', 'furthermore', 'moreover', 'notably', 'garner', 'foster',
  'boasts', 'realm', 'nuanced', 'multifaceted', 'holistic', 'leverage', 'utilize',
]

const COPULA_INFLATION = ['serves as', 'stands as', 'acts as', 'represents', 'boasts']

const STOPWORDS = new Set(('a an the and or but nor of to in on at by for with as is are was ' +
  'were be been being it its this that these those they them their there here from into over ' +
  'under out up down not no so than then when where which who whom whose what how why if else ' +
  'do does did done has have had having i you he she we my your our his her one two also can ' +
  'could would should will may might must about above after again against all any because ' +
  'before below between both each few more most other some such only own same too very').split(' '))

// --- Input ------------------------------------------------------------------

const args = process.argv.slice(2)
const asJson = args.includes('--json')
const file = args.find((a) => !a.startsWith('--'))
let text = ''
if (file) {
  text = readFileSync(file, 'utf8')
} else if (!process.stdin.isTTY) {
  text = readFileSync(0, 'utf8')
} else {
  console.error('tuned-check: give a file path or pipe text on stdin')
  process.exit(2)
}

// Strip fenced code blocks and inline code so the prose measures cleanly.
const prose = text
  .replace(/```[\s\S]*?```/g, ' ')
  .replace(/`[^`]*`/g, ' ')
  .replace(/^#.*$/gm, ' ')          // drop markdown headings from prose stats
  .replace(/^\s*[-*+]\s.*$/gm, (m) => m) // keep list lines as prose

// --- Tokenizing -------------------------------------------------------------

const lower = prose.toLowerCase()
const words = (prose.match(/[A-Za-z][A-Za-z'']*/g) || [])
const wordCount = words.length
const per1k = (n) => wordCount ? +(n / wordCount * 1000).toFixed(2) : 0

// Sentence split: naive but adequate for prose rhythm.
const sentences = prose
  .replace(/\s+/g, ' ')
  .split(/(?<=[.!?])\s+(?=[A-Z0-9"'(])/)
  .map((s) => s.trim())
  .filter((s) => (s.match(/[A-Za-z]/g) || []).length > 0)

const sentLens = sentences.map((s) => (s.match(/[A-Za-z][A-Za-z'']*/g) || []).length).filter((n) => n > 0)

// --- Metrics ----------------------------------------------------------------

function countAll(hay, needle) {
  const re = new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
  return (hay.match(re) || []).length
}

// Em dashes (matched by code point so this file holds no literal em dash).
const emDash = (text.match(new RegExp('\\u2014', 'g')) || []).length

// Hard filler.
const hardFillerHits = {}
let hardFillerTotal = 0
for (const w of HARD_FILLER) {
  const n = countAll(lower, w)
  if (n) { hardFillerHits[w] = n; hardFillerTotal += n }
}

// AI markers (word-boundary).
const aiMarkerHits = {}
let aiMarkerTotal = 0
for (const w of AI_MARKERS) {
  const n = (lower.match(new RegExp(`\\b${w}\\b`, 'g')) || []).length
  if (n) { aiMarkerHits[w] = n; aiMarkerTotal += n }
}

// Antithesis / negative parallelism family: the RHETORICAL two-clause contrast
// only. Bare negation ("X is not Y") is ordinary expository prose, not the pull,
// so it is counted separately below and never scored as antithesis. Conflating
// the two over-flags plain argument (found on the Vitalik sample, 2026-08-30).
const antithesisParts = {
  // Count SENTENCES containing the figure, not raw hits, so an anaphoric list
  // ("not just A, not just B, not just C") counts once, not four times
  // (found on the Heylighen sample, 2026-08-31).
  'not just': sentences.filter((s) => /\bnot just\b/i.test(s)).length,
  'not only': sentences.filter((s) => /\bnot only\b/i.test(s)).length,
  'not X but Y': (lower.match(/\bnot\b[^.,;:!?]{1,40}\bbut\b/g) || []).length,
  "neg, it's Y": (lower.match(/\b(isn'?t|it'?s not|it is not)\b[^.;:!?]{1,60},\s*(it'?s|it is|that'?s|they'?re)\b/g) || []).length,
}
const antithesisTotal = Object.values(antithesisParts).reduce((a, b) => a + b, 0)
const ratherThan = countAll(lower, 'rather than')
// Bare negation, reported for context only, never scored as a pull.
const bareNegation = (lower.match(/\bisn'?t\b/g) || []).length + countAll(lower, 'is not') +
  countAll(lower, 'are not') + (lower.match(/\baren'?t\b/g) || []).length

// Copula inflation.
const copulaHits = {}
let copulaTotal = 0
for (const p of COPULA_INFLATION) {
  const n = (lower.match(new RegExp(`\\b${p}\\b`, 'g')) || []).length
  if (n) { copulaHits[p] = n; copulaTotal += n }
}

// Openers.
const openers = {}
for (const s of sentences) {
  const m = s.match(/[A-Za-z][A-Za-z'']*/)
  if (!m) continue
  const w = m[0].toLowerCase()
  openers[w] = (openers[w] || 0) + 1
}
const openerRanked = Object.entries(openers).sort((a, b) => b[1] - a[1])
const sentTotal = sentences.length || 1
const topOpener = openerRanked[0] || ['', 0]
const singleOpenerPct = +(topOpener[1] / sentTotal * 100).toFixed(1)
const topN = BANDS.topOpenersPct.topN
const topOpenersPct = +(openerRanked.slice(0, topN).reduce((a, [, n]) => a + n, 0) / sentTotal * 100).toFixed(1)

// Short and long sentence share (a life-floor: some short sentences should exist).
// Note: sentence-length VARIANCE (burstiness / perplexity) is deliberately NOT
// measured. It is detector-marketing folklore, a signature of unedited output
// rather than of authorship, which GPTZero itself dropped as a primary metric in
// 2023. Standing guardrail: never cite burstiness or a detector. The real
// variation signal is structural repetition (see phrase lock-in), not CV.
const shortPct = +(sentLens.filter((n) => n < 8).length / (sentLens.length || 1) * 100).toFixed(1)
const longPct = +(sentLens.filter((n) => n > 30).length / (sentLens.length || 1) * 100).toFixed(1)

// Phrase lock-in: 2-, 3-, and 4-grams that are not all-stopword, repeated past the ceiling.
const tokens = words.map((w) => w.toLowerCase())
const gramCounts = new Map()
for (const n of [4, 3, 2]) {
  for (let i = 0; i + n <= tokens.length; i++) {
    const gram = tokens.slice(i, i + n)
    if (gram.every((t) => STOPWORDS.has(t))) continue
    if (gram.filter((t) => !STOPWORDS.has(t)).length < Math.ceil(n / 2)) continue
    const key = gram.join(' ')
    gramCounts.set(key, (gramCounts.get(key) || 0) + 1)
  }
}
// Keep the longest repeated phrases; drop a shorter gram fully contained in a kept longer one.
let phraseLock = [...gramCounts.entries()]
  .filter(([, c]) => c > BANDS.phraseLockRepeat.ceiling)
  .sort((a, b) => b[0].split(' ').length - a[0].split(' ').length || b[1] - a[1])
const kept = []
for (const [phrase, count] of phraseLock) {
  if (kept.some(([k]) => k.includes(phrase) && k !== phrase)) continue
  kept.push([phrase, count])
}
phraseLock = kept.sort((a, b) => b[1] - a[1]).slice(0, 20)

// --- Verdicts ---------------------------------------------------------------

const checks = []
function ceil(name, value, band, note) {
  const pass = value <= band.ceiling
  checks.push({ name, value, bound: `<= ${band.ceiling}`, pass, note })
}
function floor(name, value, band, note) {
  const pass = value >= band.floor
  checks.push({ name, value, bound: `>= ${band.floor}`, pass, note })
}

ceil('em dashes', emDash, BANDS.emDash, 'standing hard rule')
ceil('hard-filler / 1k', per1k(hardFillerTotal), BANDS.hardFillerPer1k, Object.keys(hardFillerHits).join(', '))
ceil('ai-marker / 1k', per1k(aiMarkerTotal), BANDS.aiMarkerPer1k, Object.keys(aiMarkerHits).join(', '))
ceil('single opener %', singleOpenerPct, BANDS.singleOpenerPct, topOpener[0] ? `"${topOpener[0]}" x${topOpener[1]}` : '')
ceil(`top-${topN} openers %`, topOpenersPct, BANDS.topOpenersPct, openerRanked.slice(0, topN).map(([w]) => w).join(' '))
ceil('antithesis / 1k', per1k(antithesisTotal), BANDS.antithesisPer1k, Object.entries(antithesisParts).filter(([, n]) => n).map(([k, n]) => `${k}:${n}`).join(', '))
ceil('"rather than" / 1k', per1k(ratherThan), BANDS.ratherThanPer1k, `x${ratherThan}`)
ceil('copula inflation / 1k', per1k(copulaTotal), BANDS.copulaInflPer1k, Object.keys(copulaHits).join(', '))
floor('short-sentence %', shortPct, BANDS.shortSentencePct, `long (>30w): ${longPct}%`)
checks.push({ name: 'bare negation / 1k', value: per1k(bareNegation), bound: '(info)', pass: true, note: 'expository negation, not scored' })

const breaches = checks.filter((c) => !c.pass)

// --- Output -----------------------------------------------------------------

if (asJson) {
  console.log(JSON.stringify({
    words: wordCount,
    sentences: sentTotal,
    lowConfidence: wordCount < 400,
    checks,
    breaches: breaches.map((b) => b.name),
    phraseLock: phraseLock.map(([phrase, count]) => ({ phrase, count })),
    inBand: breaches.length === 0,
  }, null, 2))
} else {
  const tick = (p) => (p ? '  ok ' : 'OVER ')
  console.log(`\ntuned-check  ${file || '(stdin)'}`)
  console.log(`${wordCount} words, ${sentTotal} sentences`)
  if (wordCount < 400) console.log(`(under 400 words: per-1k densities are noisy, read them loosely)`)
  console.log('')
  for (const c of checks) {
    const val = String(c.value).padStart(6)
    console.log(`${tick(c.pass)} ${c.name.padEnd(22)} ${val}  ${c.bound.padEnd(7)} ${c.note ? '  ' + c.note : ''}`)
  }
  if (phraseLock.length) {
    console.log(`\nphrase lock-in (review: necessary term or lazy repeat?)`)
    for (const [phrase, count] of phraseLock) console.log(`   x${count}  ${phrase}`)
  }
  console.log(`\n${breaches.length ? breaches.length + ' band(s) breached' : 'all bands hold'}\n`)
}

process.exit(breaches.length ? 1 : 0)
