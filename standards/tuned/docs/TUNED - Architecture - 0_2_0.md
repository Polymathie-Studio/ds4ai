# TUNED Architecture

Version 0.2.0 | 2026-08-31

The settled generating structure of TUNED, consolidated from the design work. This is the single reference for the model; the copybook format, the modes, the research plan, and the calibration results carry the detail of each part, and are pointed to where they apply. Structure over taxonomy: the spine generates, and the examples only fill it.

## The one shared space

TUNED measures and generates in a single space that is shared by everyone. The space is derived from the corpus, not asserted, and it has three tiers plus one occupant.

- Primitives. The finest measurable features of writing, each grounded in an interpretable linguistic instrument rather than a black-box score. Because each is interpretable, it reads two ways: forward as a measure, backward as a generation lever. Primitives come in three scopes (below).
- Dials. Plain-language groupings of primitives, the words a user already owns: tone, pace, length, ease, vividness. This is the basic-mode surface; advanced mode exposes the primitives themselves. Both hold on the website and inline when a copybook drives an AI assistant. A separate naming rule cuts across both tiers: everything shows under a clean plain name, and connotation-laden technical terms (arousal, valence) never surface in any view, living only in the code and instrument citations.
- Modes. Named, recurring regions of the space where dials and forms co-occur in real writing: expository-analytical, confessional-reflective, creator-punchy, lyrical-literary, polemic-combative. A mode is falsifiable, a piece either sits in its region or does not.
- The copybook. One author, expressed as a configuration over the shared space. It owns no part of the space; it is a position and a set of movements within it.

The space is common so that authors stay comparable, copybooks stay portable and forkable, and the export to an assistant stays compact.

## The three scopes

Every primitive, and every check, sits at one of three scopes, and each scope sees what the one below it cannot.

- Context. The situation, register, and needs of the piece. Sets the parameters the other scopes read.
- Unit. The sentence and the word. Where the dials live and where local checks apply.
- Set. The whole read, the collection of units together. Where form-in-totality lives, and what a per-unit procedure is structurally blind to.

Within scope, primitives are of three kinds: local (per sentence and word), higher-order (aggregates and dynamics of the local ones, such as within-piece variance, transitions, contrasts, and co-occurrence), and global (measuring the whole as a whole, not reducible to the parts).

## The generating relation, the spine

An author is not a fixed point in the space. The corpus shows authors visiting several modes and inflecting each by intent, so the structure is a relation, not a list:

An author is their repertoire of modes, plus how they inflect each, plus their switching logic, plus their signature moves. This is forced by the switching finding, not stipulated: if an author visits several modes, then the author just is that repertoire and its switching. The word individuates nothing on its own, because modes are shared; what individuates is the whole structured multiplicity.

This relocates the author rather than dissolving them. A single-voice model would flatten a real writer into one tone; the multiplicity is more faithful, and it is stable because a preference layer runs across it (below).

## The copybook is only a configuration

A copybook introduces no factors of its own. It is four things, all of them configuration over the shared space, plus a reference mechanism for the residue.

- Preferences. Cross-register dispositions the author carries across all their modes. They run on a spectrum: hard preferences are near-constants (no em-dash, in every register, near-zero variance), soft preferences are dispositions with a consistent direction whose intensity is scaled by context (a writer who drops punctuation to the extreme in a blog and mildly in an email to a friend). A soft preference composes with the register, which can amplify or damp it. Preferences are the stable core that makes an author recognizable regardless of context.
- Inflections. Per-mode deltas: how this author sits, within a given mode, relative to the mode's center.
- The register path. The author's own route through the general context-to-mode map. The map is largely shared; the author owns their particular path through it and their deviations from the typical.
- Signature moves. Named compound-configurations, recognizable regions of the space that use the higher-order primitives (a sequence, a contrast, a co-occurrence): a revelation frame, a high-register claim landed with a vernacular hammer, pedagogical triads. They are named only for human legibility and add no dimension the copybook owns.
- The residue. A genuinely one-off device with no recurring statistical signature is handled by an exemplar-anchor: a pointer at the sample to reproduce. This is a reference, not a factor.

The boundary between a shared factor and an author-owned device is policed by the factor analysis itself: a pattern that recurs across many authors becomes a shared dimension; a pattern that is essentially one author's gets no dimension and lives as a signature move.

TUNED transfers configuration, not content. It does not capture the author's lexicon or subject matter, and that exclusion is deliberate: a copybook that pinned an author's vocabulary or topics would be an imitation machine, not a voice tool.

## Every element wears two faces

Because each primitive is grounded in an interpretable feature, it is both a measure and a generation lever, and a copybook element is a triad: a prose meaning (what the user recognizes), a primitive (the hinge, which both drives generation and, read the other way, verifies), and a generation approach (what the assistant does). The prose meaning and the generation approach are the same primitive wearing its human face and its machine face.

The machine face is therefore generative, not only evaluative. The machine-readable copybook carries generation approaches, instructions to follow, not just measurable targets. Those approaches come in three flavors:

- By-instruction, for dials and primitives: prefer formal parts of speech, add hedges, descend to concretes; for a derived dial, turn the primitives that load on it.
- By-pattern, for signature moves: a sequence recipe, such as open high-formality and drop to vernacular at the close.
- By-example, for the residue and the exemplar-anchors: emulate this sample, where no instruction captures it.

The loop is self-checking: the generation approach produces the text, the primitive measures it, and verification compares that to the region the prose meaning names.

## The dials

The plain-language surface. Tone is fully operationalized as a template; the others operationalize the same way, each from a canonical instrument.

- Tone: the writer's stance, decomposed into formality (Heylighen-Dewaele F-score), warmth and energy (the NRC-VAD valence and arousal norms, surfaced as plain words), certainty (Hyland hedges against boosters), and engagement and attitude (Hyland). Detail in the copybook format, section 6.
- Pace, or rhythm: sentence-length distribution and variety, short-sentence share, long-short bimodality, boundary discipline.
- Length, or conciseness: mean words per sentence, copula inflation, redundancy.
- Ease, or complexity: the readability instruments (Flesch Reading Ease, Flesch-Kincaid grade) plus subordination depth.
- Vividness, or concreteness: the Brysbaert concreteness norms, measured as anchor density (the share of highly-concrete words), not a mean, because the mean is flat across pieces while the anchor share varies sevenfold. It forms its own dimension in the derivation, and the same primitive serves the form-in-totality substance gate.

The latent structure is derived, not asserted. Multidimensional (Biber-style) factor analysis over the primitives measured across the corpus returns the latent dimensions, and clustering in that space returns the modes. The dials are not identical to those dimensions. A first pass on the mechanical subset (see TUNED - Derivation - First Pass) shows the plain-language dial "tone" spreading across three separate dimensions, so the dials are a user-facing grouping over the derived substrate, curated for recognizability and constrained by it, not equal to it. Derive-don't-assert holds for the dimensions and the modes; the dials are the recognizable surface laid over them.

Humor and the pure signature-moves stay exemplar-anchored, with no reliable mechanical primitive; the set is honest about that gap rather than faking a dial.

Status, stated plainly: the derivation has now run three times, mechanical, then with the affect and concreteness lexicons, then with a real part-of-speech F-score (TUNED - Derivation - First Pass), so this part is no longer paper. The full arc has now run, including the higher-order dynamics and the mode clustering, on a 163-piece corpus extended with a technical band. Pace is an independent dimension; formality coheres on the master involved-and-informational axis once the tagger is real, where it had fragmented on closed-class proxies; warmth and energy are independent affect dimensions; concreteness, measured as anchor density, forms its own dimension; and tone fragments across five dimensions (which is why the dials are not the dimensions). The modes are derived by clustering rather than read off by eye, and they come out as soft regions: two are confirmed, a neutral middle is the largest, and the rest are held open pending a broader corpus. So the derivation is complete; what remains is the product, not the research.

## Form-in-totality, the set scope

The set scope is verification, not determination. The determination dials answer what the copy should be; form-in-totality answers whether the assembled whole holds. The two come apart: a piece can pass every unit check and fail as a whole. It holds three checks, and all of them resolve to an interview rather than a silent flag or an auto-fix, because the intended-versus-fault call is the writer's.

- The uniformity wall. The set of units must not collapse to one shape. Grounded in the craft literature (Williams on cohesion carrying flow rather than surface parallelism, Le Guin on unvaried symmetric repetition as the target rather than repetition itself, parallelism as a marked effect that dies on saturation), not in detector folklore. Its threshold is parameterized by context, because how much sameness is right is itself a need: seven feature headlines sharing one shape is a failure, six license-type rows sharing one shape is correct.
- Per-dial alignment with the form. Does the form match the dials. A mode is exactly the co-occurring bundle where dials and form align, so alignment means the piece sits cleanly in one mode across all scopes, which is what a unified authorial perspective is. This must be read per dial, not as one aggregate number, because a piece can be highly coherent on most dials and fail on one against the form. An unintended contrast is a fault; a deliberate one is a signature.
- The substance-and-anchor gate. Does the whole deliver the concretes its form promises, or only gesture at them. This is the presence gate, and it is not fully proceduralizable: the tool can diagnose the empty promise, but the load-bearing specifics must originate in the author's experience, so the human fills the hole the tool points at.

Coherence is necessary but not sufficient: a piece can be perfectly aligned and empty. Good form is the sweet spot of all three, varied enough not to template, unified enough to read as one voice, and grounded enough to deliver. The uniformity wall and the alignment check pull in opposite directions on purpose, and together they define the target.

The discrepancy signal is a conjunction, never a single metric: a form that promises concretes, abstraction that stays high, and no concrete anchors anywhere. Any one of these alone false-positives. Reader comments on published pieces are the verifier's ground truth, since they are exactly these reader-decision tests: did the piece deliver what it promised, and can I tell what is on offer.

## The user profile

Standing, per-user, above any single copybook. The concern-model states what the person cares about, their demarcations, the thresholds where stakes rise, and their definition of done; it decides when the instrument engages at all (public writing, not private).

English-language status is a first-class field of this profile. Whether English is the user's first, second, or third language, and ideally which language is native, scopes how the tool operates. It sets the default posture toward deviations: for an L1 writer, an off-norm feature is presumed a choice, voice until questioned; for an L2 or L3 writer, it is presumed ambiguous, so the tool leans into a keep-versus-fix interview rather than treating a deviation as an automatic signature. The named first language matters more than the ordinal, because transfer is language-specific (article use, nominalization, aspect), so knowing it lets the interview point straight at the likely pattern.

Two guardrails hold this field. It is self-declared, never inferred, because inference false-positives and guessing a person's first language from their prose is presumptuous. And it scopes support, never expectations: it offers more of the keep-versus-fix help where a writer wants it, and never labels a deficit or lowers the bar. L2 and L3 writers are a first-class target audience, not an edge case, because the recognition-without-production split the tool rests on fits them exactly: they read English fluently and produce it with first-language texture, so they have the half everyone reliably has and lack the half the model supplies.

The language field is a profile parameter, distinct in kind from a writing-preference. A preference is a disposition the copybook applies to the text; the language field tunes how the tool interprets the writer's deviations.

## The operation

The parts run in a fixed order, and compensation always precedes aiming, because a target laid over an uncompensated instrument is pulled back toward the median.

1. Compensate the instrument to a de-biased base. The model carries measured, per-model pulls toward the median (for the current model: expression lock-in, opener-monotony, filler leak), and the compensation layer neutralizes them. The base is the human envelope's central tendency, not zero.
2. Engage or not, by the user's concern-model. Private, and TUNED stays off. Public, and it runs.
3. Apply the author's preferences and the situational mode together, preferences cross-register and the mode selected by context, composing, with a soft preference scaled by the mode. A hard preference that conflicts with what a mode wants takes precedence.
4. Inflect the mode by the author's per-mode deltas, and lay on the signature moves.
5. Direct by recognition and correction, and fix the target once it settles.
6. Verify, at two scopes. Local verification checks that each primitive landed in its target, pass-or-fail for a hard preference and tolerance for mode-membership. Totality verification runs the three set-scope checks. Any trip opens an interview rather than a verdict.

## The engine

A copybook is a configuration, the fuel. The engine is the runtime that burns it into text, and it is the one part still to build. Its estimand is the construct's own drift, and it is built as a CRAFT evaluation chain that binds that drift measurably, because drift is an error introduced at a stage that is invisible in the output, which is precisely the failure an evaluation chain exists to catch. Being a CRAFT chain is all-or-nothing: the six conditions are jointly necessary, so this is a top-down build from a decision context, not a shaping bolted onto the scorer.

Two contaminations, two sterilizations. The construct carries baked-in per-model pulls (the measured profile: expression lock-in, opener monotony, filler leak) that live in the weights, so every instance has them and compensation is what counters them. It also accumulates context drift, the reverting-to-median a running session picks up, which a fresh instance is clean of. These are orthogonal: a fresh agent is un-drifted but still un-compensated. Both cleanings land on whoever writes, and the writer is that clean agent, spawned fresh to escape the context drift and compensated to counter the pulls, never the initiator, which is too contaminated to hold the pen if it is too contaminated to confirm itself.

The pipeline is a dependency chain, each stage gating the next: initialize the instrument by zeroing its pulls; configure it from the copybook into the target; confirm the initialization independently; write under the process bounds; verify the output landed; feed the verdict back.

The scorer is the instrument, in CRAFT's Condition 3 sense: it measures the drift (the pull-signatures and the dimensions) and states its own uncertainty (the noise floor, the coverage), or it is not an instrument but an unverified process. This is the one piece already built, by the derivation. The scorer is the drift sensor. Its uncertainty makes the drift verdict three-valued, not binary, which is CRAFT's resolution floor and indeterminate outcome (Section 12.2): clean where the reading minus its uncertainty clears the bound, drifted where the reading plus its uncertainty fails it, and indeterminate where the reading straddles the bound inside the noise floor. Indeterminate is its own outcome, not collapsed to a pass or a fail the instrument cannot support, and it routes to the writer's origin.

ORE grades the door in. The primary source the write rests on is the zeroed instrument itself, and ORE grades that state as uncertainty rather than assuming it. What confirmed the zero sets its grade: the construct's own report of being clean is single-party and trust-based, the weakest case; an independent measurement by the scorer is the strong case; an unconfirmed zero is the highest uncertainty of all. The ORE reframe is what makes this bind: an ungraded or unconfirmed zeroing is a recorded state of high uncertainty carrying a monitoring obligation, never a blank that reads as clean. So the engine cannot silently assume the zeroing held; it grades it, and the write exposes that grade. The corpus and lexicons the scorer relies on are graded the same way.

The confirmation is independent, which is CRAFT's non-self-adjudication invariant (7.2): the basis on which the write can be overturned is not controlled by the writer. It admits two realizations, and the drift splits cleanly across them. Drift the scorer can measure is a determinate-resolution claim, the instrument checked against pre-specified bounds, so it takes the mechanical realization. The residue the scorer cannot measure, the structural template and the no-one-home quality, is a reflective-construct claim the mechanical realization is not available for, so it keeps an independent attester.

STRUCK governs the door out. The engine's verdict carries the five obligations on its face: the graded support including the zeroing grade, the refutation condition (the discrepancy signal), the contest kept rather than averaged (which is why the alignment read is per-dial and never one combined score), the worth-judgment left to the consumer (the interview), all on the face of the output.

Feedback closes the loop and makes it learn, which is Condition 6 and is not optional, since a chain is not a chain without it. The independent verification's findings propagate back at the depth the drift lives: single-loop regenerates a drifted instance; double-loop revises the compensation or the bound when a class of drift keeps escaping; triple-loop re-examines the decision context when no revision binds it. This turns the pull-profile from a one-time measurement into a live quantity that tightens as the model's actual escapes feed back. Two disciplines keep the loop honest: a tightened bound is declared before the next write, never fitted to excuse the one that just failed; and the feedback is read from two directional origins, the scorer and the writer, where the writer judging whether the piece reads as theirs is how the residual drift the instrument cannot see gets bound. The interview does double duty here, STRUCK's worth-judgment at the exit and Condition 6's second origin in the feedback.

The construction grammar is what makes this a domain application rather than a chain that merely passes the six conditions (CRAFT Section 9), and three of its requirements bind here. Structural operativity: the drift-binding runs on every write, in the execution path, never as a periodic audit, and a bypass is itself a signal that enters the feedback. Response architecture: each detected drift carries a declared response, and the response splits by cause, which the standard requires kept distinct. Accidental drift, the ordinary reversion, is corrected, regenerated and propagated. Adversarial drift, a construct writing to the measurable numbers while letting the residue slip exactly where the scorer cannot see, is the gaming the decision context named, and its response is closer to suspension and notifying the risk-bearer than to a retry. Domain bifurcation: the boundary between the drift the scorer measures and the residue only the writer can judge is not a caveat we may add but a declaration the grammar requires, so the honest boundary below is mandatory, not optional.

The honest boundary the chain forces: the scorer bounds the drift it can see, and the residue is bounded only by the attester and the writer's origin, declared as out of instrument scope rather than laundered into the graded, which is STRUCK's refusal applied to our own drift.

Status: the instrument is built, the engine is not. The engine is owed as a CRAFT chain built top-down from its decision context (what decision the verification supports, for whom, against which adversary, valid under what conditions), and full conformance as a domain application also owes the Section 9 construction grammar above and a Section 10 inheritance receipt, which declares the chain's inheritance from CSIS and Frame Language, not from CRAFT alone. That receipt is the real scope of getting it right, and it is not yet written. A discipline on ourselves: the derivation that built the scorer is exploratory research, not a CRAFT chain, and is not claimed as one; only the running verification owes conformance, because only its claims drive a user's decision.

## What is grounded, and what is owed

Grounded and derived: the generating relation, the tone primitives (their instruments verified against source), the compensation profile (measured on real output), the corpus (148 pieces, 282,931 words, preserved durably). Pending the factor pass, not yet established: the dial set and the modes, which are method-defined but unrun. Engineering, not writing-research claims: the interface tiers, the process bounds. Honestly labeled so the scaffold never wears the authority of the research.

Decisions taken: a copybook is only a configuration; TUNED transfers configuration, not content; the pipeline order above; the language field as a profile parameter.

The central engineering risk, now specified but not built: the engine that turns a target into text that hits it, live. It is set out in The engine above, as a CRAFT chain whose estimand is the construct's drift, with the scorer as its instrument, ORE at the door in, STRUCK at the door out, and Condition 6 feedback that makes the drift-binding learn. The instrument is built; the chain is not.

Coverage limits, honestly recorded: the primitive set is mostly sentence-level and lexical, so document-level structure (the arc of a whole piece) and prosody (the sound below the sentence) are under-reached, and the lyrical mode especially loses its melody. These are known blind spots, not solved.

A strength worth naming: because the shared space is pre-derived from the corpus, a new user with one document can still be placed in it, so a copybook works from little input, provisionally, without needing the user's whole body of work.

## The next build

The derivation is built and run in full: the primitive set (the real part-of-speech F-score, the Hyland lists, the NRC-VAD and Brysbaert lexicons, the readability functions, and the higher-order dynamics), the factor passes over the durable corpus, and the mode clustering. Diction is measured (Brysbaert as anchor density) and forms its own dimension. What remains is no longer research but the product: the generation loop that turns a dial target into text that hits it (the central engineering risk), the tuning site, the copybook capture and export, the verification logic over the built primitives, and a license-clean runtime scorer. See the research plan's coverage matrix for the itemized state.

## Where the detail lives

- Copybook format: the copybook's sections, the factor inventory, tone's operationalization, and the machine-readable form. TUNED - Copybook Format.
- Modes: the emergent modes as factor-signatures. TUNED - Modes.
- Layer coverage and what is owed per part. TUNED - Research Plan and Layer Coverage.
- Calibration data and the model profile. TUNED - Calibration Corpus Results.
- The corpus itself. corpus/raw, with its index.
- The prior four-slot spine and the engine-copybook-process split. TUNED - Structural Spine, TUNED - Structure and Copybook Plan.
