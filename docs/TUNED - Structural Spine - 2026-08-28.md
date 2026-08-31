# TUNED - Structural Spine

Version 0.1.0 | 2026-08-28

## What this is

The generating structure of TUNED, abstracted from a long design session. The particular examples that surfaced during it (public versus private, the antithesis tell, this author's own voice) are illustrative, not structural. This document states the underlying structure those examples instantiate: the slots, and the operation, that would produce any user's version. Structure over taxonomy, in the corpus's own terms: the spine generates, the examples only fill it.

## The frame the spine rests on

Four reframings from this session that the structure depends on.

Writing by an AI is the model mirroring a target, and mirroring yields an impression. The output is always the model's impression of what it takes the target to be, never the target itself, and TUNED says so plainly. This is true from the first word and after a hundred corrections.

A voice is a range, not an invariant. Variety is the human signal and uniformity is the AI tell, so the reusable target describes a space to vary within rather than a fixed template. Reaching for an invariant is the standards-builder's reflex, and it is the wrong reflex for this subject.

The person directs and the model produces. The person supplies recognition and correction, not writing skill, so TUNED serves someone who cannot write the target themselves; they point, and the model renders.

TUNED applies to public writing only. Prose meant for a reader whose judgment carries weight is in scope; conversation, code, and private working documents are not. The private-to-public crossing is the point where getting the tone right suddenly matters.

## The slots

Any instance of TUNED fills four slots.

1. The instrument, characterized and compensated. The model carries systematic drifts toward the median, its pull-profile, measured behaviorally and per model, and the compensation layer neutralizes them to a de-biased base. Filled by the median-pull inventory (the shared pull set) plus a per-model profile. This author's model-profile is one filling, and it must be measured on public writing rather than conversation.

2. The user's concern-model. A standing, per-user statement of what the person cares about, their demarcations, the thresholds where stakes rise, and their definition of done. It sets the objective and decides when the instrument engages. Filled here by the public-private demarcation, plus not-reading-as-AI, plus an authored voice. Another user's concern-model can differ completely and must be drawn out fresh, never assumed from this one.

3. The target, graded and composed. What the impression aims at, graded from the floor (not-reading-as-AI, no particular voice) up to a specific voice at the ceiling, and decomposed into reusable orthogonal dimensions: voice as a range, context as the situation, intent as the purpose, composed at run time. Aimed by the user's recognition. Filled by this author's voice, registers, contexts, and intents.

4. The direction mechanism. The target is not captured up front. It accretes through correction over time and is fixed at recognition, scoped to a slice such as one context or one register. The output stays an honest impression the whole way through.

## The operation

The slots run in a fixed order.

First, compensate the instrument (slot 1) to a de-biased base. That base is the floor: not-AI, with no target applied.

Second, engage or not, by the user's concerns and demarcation (slot 2). Private, and TUNED stays off. Public, and it runs.

Third, aim at the target (slot 3), composed for this run from voice, context, and intent.

Fourth, direct by recognition and correction (slot 4), and fix the target once it settles.

Compensation always precedes aiming, because a target laid over an uncompensated instrument is pulled back toward the median.

## The engine and artifact split

The heavy, shared, register-independent machinery, the compensation engine, the instrument-model, the interview and schema, and the verifier, is authored once and is the same for everyone. The thin, per-user artifacts, the concern-model and the voice with its contexts and intents, are authored by each person, often by forking an example. This split is what keeps the per-user artifacts small and shareable.

## Where the existing artifacts sit

The median-pull inventory (v0.2.0) is the content of slot 1's compensation layer, the shared pull set. The model pull-profile for claude-opus-4-8 (v0.1.0) is a first filling of slot 1's per-model calibration, but it was measured on conversation and is out of scope, so it needs redoing on public writing. The earlier structure and copybook plan (v0.1.0) is the prior architecture, and this spine sits above it; its engine, copybook, and process detail is one realization of these slots and needs reconciling to today's refinements, the concern-model, the public-private scope, and voice-as-range.

## Deferred to completion

Establishing TUNED as a general method, and writing the public-private awareness into the personal method as a standing principle, both wait until TUNED is finished, so the general version is not splintered off before the whole exists.
