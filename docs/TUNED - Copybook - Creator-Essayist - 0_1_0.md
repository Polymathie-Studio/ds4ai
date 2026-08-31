# TUNED Copybook - Creator-Essayist (Kaguura)

Version 0.1.0 | 2026-08-30
Status: first worked example of the copybook format. Derived from a single exemplar, so the numbers are provisional; firm them into ranges by measuring more creator-essayist exemplars before treating this as authoritative.

## What a copybook is

A copybook is a reusable target-voice profile: the thing TUNED aims at once the model has been compensated to a de-biased base. It is not the compensation layer (which removes the model's pulls) and not the concern-model (the author's own constraints). It is slot three, the target, and it is measurable, because measuring an exemplar of a register is the same act as defining a target for it.

Two rules make copybooks work. First, targets are copybook-relative: the same feature can be wanted in one copybook and banned in another (see em dashes below). Second, a copybook is aimed at only after compensation; it never licenses the model's own pulls. Every target value here sits inside the human range established by the calibration corpus, so aiming at this copybook cannot smuggle the median back in.

## Identity

- Name: Creator-Essayist
- Register: feed-native persuasive essay, optimized for reach and shareability
- Exemplar: Kaguura Gichuru, "The Mathematical Reason Most People Never Make It" (The Write Path), 2026
- Purpose and scope: public writing meant to spread on a platform feed; hook-driven, high-engagement
- Optimizes: reach, shareability, immediate comprehension
- Trades against: the uncaptured-rigor position. This copybook is platform-shaped, so it pulls toward the algorithm's incentives. Choose it when reach is the goal, not when the standing-outside stance is.

## Measured target profile

From tuned-check on the exemplar (1036 words, 91 sentences). Single-exemplar, so read these as a center point to widen into a range, not a fixed spec.

| parameter | measured | target |
|---|---|---|
| mean sentence length | 11.4 words | ~10 to 13 |
| short sentences (<8 words) | 34.1% | high, >= 25% |
| long sentences (>30 words) | 2.2% | low, < 5% |
| single-opener concentration | 16.5% | <= 17% (stay inside human range) |
| top-6 opener share | 44% | <= 45% (runs higher than the intellectual copybook) |
| em dashes / 1k | ~3.9 | allowed |
| antithesis / 1k | 0 | <= 1.5 |
| "rather than" / 1k | 0 | <= 1 |
| ai-marker / 1k | 0 | <= 1.5 |
| hard filler / 1k | 0 in body | light colloquial permitted |

## Structural moves

These are the qualitative targets, the part no band captures.

- Hook first. Open on a concrete, slightly surprising observation, not a thesis.
- One-line paragraphs as beats. A single short sentence on its own line does the emphasis work ("So I did some digging." "That's insane." "No.").
- Revelation frame. Set up a pattern, then name it as a thing the reader cannot now un-see ("once you see it, you can't unsee it").
- Data-anecdote-to-lesson arc. A statistic or story, then the extracted principle, then its consequence for the reader.
- Escalate to a payoff. Short sentences accelerate into the turn; the point lands on a beat, not mid-paragraph.

## Diction and tone

Plain declaratives carrying the argument, with placed colloquial spikes ("doesn't give a fuck," "you might be cooking at a different level") used sparingly for jolt. Second person, direct address. Confident, not hedged.

## Punctuation and parameter overrides

The copybook-relative settings, where this profile departs from a default:

- Em dash: allowed and characteristic, as the aside marker. This is the clearest proof that bands are copybook-relative: the standards copybook bans the em dash outright, and here it is a target feature. Same mark, opposite setting.
- Hard filler: light colloquial filler is tolerable in this register, unlike the standards copybook's zero.

## How it composes with the layers

Order is fixed. Compensate the model to the de-biased base first, then aim at this copybook. The targets above already live inside the human range, so they do not reopen the pulls the compensation layer closed. Concretely: even while aiming here, the opener-monotony guard and the "rather than" guard still hold, because Kaguura himself sits inside them (16.5% and 0). The copybook sets the aim; the compensation layer sets the floor; the aim never drops below the floor.

## Machine-readable form

```json
{
  "copybook": "creator-essayist",
  "version": "0.1.0",
  "exemplars": ["kaguura-gichuru/price-law/2026"],
  "provisional": true,
  "targets": {
    "sentence_mean_words": [10, 13],
    "short_sentence_pct_min": 25,
    "long_sentence_pct_max": 5,
    "single_opener_pct_max": 17,
    "top6_opener_pct_max": 45,
    "em_dash_per1k_max": 6,
    "antithesis_per1k_max": 1.5,
    "rather_than_per1k_max": 1.0,
    "ai_marker_per1k_max": 1.5,
    "hard_filler_per1k_max": 1.0
  },
  "overrides": {
    "em_dash": "allowed",
    "hard_filler": "light-colloquial-permitted"
  },
  "structure": [
    "concrete-hook-open",
    "one-line-paragraph-beats",
    "revelation-frame",
    "data-anecdote-to-lesson",
    "escalate-to-payoff"
  ],
  "optimizes": ["reach", "shareability"],
  "trades_against": ["uncaptured-rigor-position"]
}
```

## Provenance and how to firm it

Derived from one exemplar, so the target numbers are a center point, not a range. To firm the copybook: gather three to five more creator-essayist pieces (high-engagement, feed-native), run each through tuned-check, and set each target to the envelope across them rather than to Kaguura's single values. The structural moves are already stable enough to keep; the numbers need the wider sample.
