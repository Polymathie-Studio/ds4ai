# TUNED Modes

Version 0.1.0 | 2026-08-31 | first pass, emergent from the calibration corpus

A mode is a named, recognizable combination of factor values, a characteristic region in factor-space that recurs across many authors. It sits between the factors (the atoms) and the copybook (an author, defined as their repertoire of modes plus how they inflect each plus their switching logic). Modes are the general, shareable unit; an author's uniqueness is which modes they use and how they inflect them. A mode is selected at run time by context and intent, which is the operational form of "voice is a range."

A mode is exactly the co-occurring bundle where the dials and the form align, the combination that actually shows up together in real writing. This is why a mode grounds coherence: a unified piece sits cleanly in one mode across all its scopes, and the set-scope alignment check (form-in-totality, in TUNED - Architecture) reads that mode-fit per dial. When a piece's dials say one mode and its form says another, that mismatch is the diagnosis, a fault if unintended and a signature if not.

Two disciplines hold this to structure rather than taxonomy. First, a mode is defined by its factor-signature, so a piece either sits in the region or does not; it is falsifiable, not a vibe. Second, this list is emergent and illustrative, read off roughly twenty-three authors and about a hundred pieces, not a fixed catalog. It will sharpen as the spread widens and as genuinely singular voices are added.

Empirical check (2026-08-31): the corpus was clustered in the derived dimension space (TUNED - Derivation - First Pass). The clustering strongly confirms expository-analytical and confessional-reflective, and finds them to be the primary divide (the single strongest split separates formal-detached from personal-involved). It does not reproduce creator-punchy, lyrical-literary, or polemic-combative as distinct populated regions; creator-punchy appears only as single-author outliers, and a large neutral-middle region that is not in the list below is the biggest cluster. Silhouettes are low, confirming that modes are soft regions on a continuum, not tight bins. So the five below are provisional against the data: two are confirmed, a neutral middle is owed, and the other three are either under-sampled, absorbed, or better treated as signatures. Reconciling the named set with the derived regions is a normative call, and the ruling (2026-08-31) is to hold it open. The five below stay as provisional targets the tool can still aim at, the neutral middle is treated as an observed but unnamed region, and the final reconciliation waits until a broader corpus (fiction, reportage, and other out-of-band registers) tests whether the three unconfirmed modes appear once writing that exhibits them is actually in the sample. The clustering re-runs on any future corpus (tuned-modes.py), so this is a decision to gather more before cutting, not to guess.

The empirical ground for the mode layer: within-author mode-switching is pervasive in the corpus. Almost every author sampled visits two or more of these modes depending on what they are doing. Petersen runs one mode's opener concentration at 6.9% and another's at 29.8%. Mollick swings from measured research prose to a staccato demo. Oster from data-explainer to personal consolation. Tina He from lyrical to flat market prose. That switching, not a fixed per-author voice, is what the corpus actually shows.

## The recurring modes

### Expository-analytical

- Cadence: long, subordinated sentences, a heavy long-sentence tail (20 to 38 percent over thirty words), low short-sentence share.
- Opener character: "the," "this," "it" openers, moderate-to-high concentration (a register feature, not a tell).
- Diction: definitional and precise, domain vocabulary, higher on the abstraction ladder.
- Structure: claim, frame, prove; enumerative; nested reasoning.
- "Rather than": near zero.
- Visited by: Ostrom, Vitalik, Heylighen, Weyl, Zargham, Siddarth, Yglesias in argument, Mollick in research, Oster in her technical pieces, Petersen in analytical mode, deBoer in his craft essay, Christine Kim in her opinion-analysis essays.
- Sub-region, the reference-explainer: a denser, more definitional variant that runs on the "The X is..." sentence, pushing opener concentration high and short sentences to almost none. Christine Kim's Governance-101 pieces are the clearest instance (single-opener 19.7 percent, short-sentence share 1.6 percent). It is the technical Web3 core-contributor register, a sub-mode inside this one rather than a species of its own.

### Confessional-reflective

- Cadence: mixed, with a high short-sentence share (15 to 30 percent), punchier than the analytical mode.
- Opener character: first-person "I" and "we" openers at high concentration.
- Diction: warm, colloquial, concrete and personal, lower on the ladder.
- Structure: narrative-anchored openings, personal opening widening to a general point.
- Filler: colloquial markers ("of course," "honestly") present naturally.
- Visited by: Petersen in confessional mode, Tressie in memoir, Stella in journaling, Oster in her personal pieces, Mollick in his demo, Artem.

### Creator-punchy

- Cadence: very short sentences, a high short-sentence share (20 to 34 percent), one-line paragraphs used as beats.
- Opener character: hook-first, varied or leaning on "the" and "you."
- Structure: hook, then a turn, then a payoff; the revelation frame; the data-anecdote-to-lesson arc.
- Visited by: Kaguura, Packy in his early tweet-driven pieces, Timber.

### Lyrical-literary

- Cadence: even-weighted and rhythmic, parallel and anaphoric, long but musical.
- Punctuation: em-dash-heavy, author-dependent.
- Diction: elevated and imagistic, often with borrowed or coined terms.
- Structure: incantation and procession, braided allusion.
- Visited by: Jeremy, Hoel in lyrical mode, Tina He in lyrical mode, Packy in his mythic pieces.

### Polemic-combative

- Cadence: short declaratives, high verdict density, punchy.
- Opener character: "But," "The," "I"; combative starts.
- Diction: direct, colloquial, sharp.
- Structure: claim, attack, verdict.
- Visited by: deBoer in polemic mode, Yglesias.

## Signature moves overlay the modes

An author's distinctiveness is not only which modes they use but the signature moves they lay over a mode. These are named devices, not modes themselves: Tressie's register-collision (a high-register claim landed with a vernacular hammer), Kaguura's revelation frame, Heylighen's pedagogical triads, Jeremy's braid of named thinkers. A punctuation habit can be a signature too, and its absence as much as its presence: Christine Kim avoids the em dash almost entirely across sixteen pieces, reaching for colons and semicolons, which is as distinctive as Heylighen leaning on the dash. A copybook records both the modes an author visits and the moves and habits they run inside them.

## How the tool uses this

At run time, the declared context and intent select the mode; the mode supplies its factor targets; the author's copybook inflects those targets and adds the author's signature moves. Compensation of the model's pulls (chiefly "rather than," the one cross-mode discriminator) runs first, underneath all of it. The mode is the aim; compensation is the floor.

## Open

- Firming each mode's factor-signature into ranges as more authors are sampled, especially singular stylists whose pronounced signatures make the factors most legible.
- Whether the five here are the right cut, or whether some split (the analytical mode may divide into technical-definitional and wonk-argumentative) or merge.
- The selection logic: exactly how context and intent map to a mode.
