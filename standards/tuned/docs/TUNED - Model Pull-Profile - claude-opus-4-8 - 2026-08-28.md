# TUNED - Model Pull-Profile - claude-opus-4-8

Version 0.1.0 measured | 2026-08-28

## What this is

The per-model calibration for TUNED's compensation layer: one model's actual pull-profile, measured from its own output rather than reported by it. It says which of the ten median pulls are strong for this specific model, with the measured rates as the evidence, so the compensation layer can weight its guards toward where this instrument really drifts and spend little on where it does not. It is the instrument-side data the tuning frame requires, the analogue of a display's measured gamut in TEMPER.

## Method

Extracted 62,304 words across 313 of this model's visible responses from one working session's transcript, excluding thinking, tool calls, and subagent output. Ran mechanical counts against the pull signatures from the inventory. The approach is behavioral by design: it measures produced text, not the model's account of itself, because the self-account is subject to the very pulls it would be naming. Findings were cross-checked against Durgadas's logged corrections. Caveats are at the end.

## The measured profile

### Strong pulls (high measured rate, guard first)

1. Antithesis and negative parallelism (inventory entry 5). Measured: "not just" 30, "it's not / it is not" 29, "not only" 15, "isn't" 12, together about 1.2 per thousand words, with "rather than" adding a further 103. This converges with Durgadas's logs, where it is named the top verbal tell after the em dash. Guard aggressively, at the function level.

2. Expression lock-in (inventory entry 10). Measured in a single session: "the floor" 43, "the mirror" 25, "load-bearing" 24, "the tell" 23, "the median" 12. Part of this is necessary concept-naming, but a density near 0.7 per thousand for one phrase is past what the concept needs. Guard with the necessary-versus-lazy split and a diversity pass.

3. Filler leakage (inventory entry 7 and a standing hard rule). Measured: "genuinely" 27, "honestly" 16, both on the banlist. This is the clearest demonstration of why calibration must be behavioral: a self-report would have claimed compliance, and the count refutes it.

4. Opener monotony (inventory entry 1, at the opener level rather than the length level). Measured: the six most common sentence-openers cover 38.6 percent of all sentences, and "The" alone begins 16 percent. Because sentence-length variety is healthy for this model (see the weak list), the uniformity in its output is concentrated in how sentences start. Guard the opener, not the length.

### Moderate pulls

5. Emphatic-frame habit, this model's form of inventory entry 2. Classic hedging is low; the house-style tell here is a committal over-emphasis instead, "which is exactly" 14 and similar frames. For this model, entry 2 shows as over-emphasis, not over-hedging.

6. Connective lean. "rather than" at 103 is high for one connective and reads as a mild coherence-smoothing signature (inventory entry 3).

### Weak pulls (low measured rate, low priority for this model)

7. Classic hedging and signposting (inventory entry 2): "importantly" 1, "generally" 2, "that said" 1. This model is fairly committal.

8. Sentence-length uniformity (inventory entry 1, length): coefficient of variation 0.64, with 16 percent of sentences short (under 8 words) and 16 percent long (over 30). Healthy burstiness at the length level.

9. Em dash: zero occurrences across 62,000 words. The one rule under mechanical enforcement is followed perfectly.

### Not measurable from this model's text alone

- Sycophancy (inventory entry 7, the agreement face): needs the interaction pattern, not a word count. Durgadas's logs confirm it is real.
- Over-unification (inventory entry 6): a semantic tell, confirmed by the logs, invisible to a lexical count.
- Collective convergence (inventory entry 8): needs a cross-author corpus, out of reach of a single-author sample.

## What the calibration changes

The generic inventory says to guard uniformity, hedging, and filler. This model's actual profile is more specific and in places different. Its uniformity is in openers, not length. Its house-style tell is emphasis, not hedging. Its filler breach is two specific words. And its strongest guards, by evidence, are the antithesis, the phrase lock-in, and the opener monotony. A compensation layer tuned to this profile weights those and does not waste effort on the weak ones.

## The strongest single lesson

Em dashes sit at zero because they are checked mechanically before a file is saved. "genuinely" and "honestly" sit at 27 and 16 because the rule against them lives only in intention. Equal standing, unequal enforcement, opposite outcomes. The compensation layer should mechanically check its guards rather than rely on the model intending to obey them.

## Caveats

One session, one model, one author. The later stretch of the sample includes responses where the model was consciously suppressing tells after Durgadas flagged them, which biases the strong-pull rates downward, so the untuned rates are likely higher than measured here. Necessary concept-repetition inflates the entry-10 raw counts. The method reaches lexical and structural tells well and semantic ones not at all, so sycophancy, over-unification, and convergence rest on the logs rather than on these numbers. A fuller calibration would add probe tasks designed to elicit each pull under controlled conditions, and would re-measure on a fresh, un-flagged sample.
