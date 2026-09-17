# TUNED - Calibration Corpus Results

Version 0.2.0 | 2026-08-31

The measurements behind the calibration findings. The corpus grew from the initial nine writers to roughly twenty-three authors across a dozen registers (about a hundred pieces), admired-field writers plus a deliberately outside-field general spread, each measured with tuned-check.mjs, plus the model's own output as the AI reference. The findings below reflect the full corpus; the table that follows is the original nine-author subset (kept because its rows are transcribed here durably), with the rest of the per-piece metrics in the session scratchpad batch files.

## The measurements (initial nine-author subset)

| writer | register | words | single opener % | top-6 openers % | "rather than" /1k | antithesis /1k | em dash | note |
|---|---|---|---|---|---|---|---|---|
| Tressie McMillan Cottom | cultural, 2021 | 6010 | 6.2 | 32.3 | 0.17 | 0.33 | 0 (converted) | clean human |
| Vitalik Buterin | governance, 2021 | 2412 | 14.9 | 47.5 | 0 | 0.83 | 0 | clean human; heavy plain negation 3.32 |
| Scott H. | technical, 2026 | 1493 | 17.1 | 47.9 | 0.67 | 1.34 | 0 | AI-collaborated (disclosed); fragmented, mean 12.8 |
| Artem | reflective, 2026 | 958 | 14.3 | 50 | 0 | 0 | 16 | fluent Russian-first; em dash is L1, not AI |
| Timber Stinson-Schroff | analytical, 2025 | 1694 | 5.7 | 27.9 | 1.77 | 1.18 | 0 | clean human (self-attested); "leverage" tripped ai-marker as topic |
| Jeremy D Johnson (1) | lyrical, 2026 | 534 | 16.7 | 60 | 0 | 1.87 | 0 (dbl-hyphen) | short sample, densities noisy |
| Jeremy D Johnson (2) | essayistic, 2026 | 1082 | 11.3 | 38.7 | 0 | 0.92 | 0 | clean human |
| Francis Heylighen | academic, 2026 | 994 | 14.7 | 50 | 0 | 2.01 | 3 | Belgian; antithesis was anaphoric "not just" list |
| Kaguura Gichuru | creator-essayist, 2026 | 1036 | 16.5 | 44 | 0 | 0 | 4 | clean human-passing; mean 11.4, short 34% |
| **model (this AI)** | **drafted spec** | 2497 | **27.9** | 50 | **3.6** | 0.80 | 0 | AI reference |

## What it establishes

Widened from nine to roughly twenty-three authors across a dozen registers (about a hundred pieces), the two-discriminator claim collapsed to one, and a stronger finding took its place.

No discriminator survives. "Rather than" looked like the last one, model 3.6 against a human ceiling of 2.88, but the 3.6 came from a single dense spec section. Measured on 108,000 words of the model's real writing across this working thread, its "rather than" rate is 2.6 per thousand, below Christine Kim's human 2.88. So detection is empty, not thin: no mechanical feature separates the model's real writing from clean humans. The value is entirely in targeting factors and modes, not in detecting AI. The model's real profile is per-model style (expression lock-in "is exactly" x79, opener-monotony "the" at 16 percent, filler leak 0.91 despite the ban), not a universal tell, and belongs to Layer 1 compensation.

Opener concentration is disconfirmed. It looked like a second discriminator on the first nine samples, but the wider corpus broke it: Petersen alone runs single-opener at 6.9 percent in analytical mode and 29.8 percent in confessional mode, and clean humans span 6 to 32 across the corpus. It is mode-relative, not a tell.

Everything else is mode-, register-, first-language-, or typography-relative, now conclusively:

- Filler banlist: over-flags nearly every fluent human ("of course," "honestly," "certainly," used naturally). A concern-model override and retirable scaffold, not a baseline fact.
- Em dash: tracks typesetting, edition, and first language, and swings within a single author by mode. No authorship signal. It spans 0 (Christine Kim avoids it entirely across 16 pieces, reaching for colons and semicolons) to 24 (Heylighen), which is the clearest proof it is pure style. Its absence can itself be a copybook signature.
- Antithesis: mode-relative, near zero in analytical mode and up to 3.84 within one author's confessional mode (Petersen). Counted per sentence to avoid anaphora inflation.
- Short-sentence share and bare negation: register-relative; dense academic writers run almost no short sentences.
- Sentence-length variance: not measured, retired as detector folklore.

The bigger finding: the mode layer is empirical. Within-author mode-switching is pervasive, almost every author visits two or more modes by intent, which is why nearly every non-"rather than" feature is mode-relative rather than a tell. See TUNED - Modes - 0_1_0.md for the emergent modes as factor-signatures.

## Where the data lives

The per-piece metrics for all authors are in the session scratchpad (batch-*.txt runs). Those are ephemeral; if the raw rows should persist, they need consolidating into a data appendix here. What is durable and captured is the findings above and the modes doc.

## Caveats

The spread so far is strong writers but few genuine singular stylists, and the modes are read off that. Firming each mode into factor-ranges wants more authors, especially singular voices whose pronounced signatures make the factors most legible. The corpus also doubles as a copybook library and the podcast guest map.
