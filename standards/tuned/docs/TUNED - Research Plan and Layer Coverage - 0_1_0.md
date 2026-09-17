# TUNED Research Plan and Layer Coverage

Version 0.1.0 | 2026-08-31

The settled model is stated whole in TUNED - Architecture (0.2.0); this doc tracks the layer-by-layer coverage and what is owed. The four-level shared space (primitives, dials, modes, copybook), the three scopes (context, unit, set), the copybook-as-configuration, the generation-pairing, form-in-totality, and the user profile with its English-language-status field all live there.

Coverage synced to the empirical derivation on 2026-08-31 (see TUNED - Derivation - First Pass). Much of Layer 2 is now measured rather than owed; the running code lives in the git repo at ~/code/tuned.

## The mandate

Research is planned layer by layer, to completeness. Every layer of the tool is decomposed into its parts, and every part is carried through three states: identified, then operationalized (defined in specific measurable terms), then calibrated (ranges and bounds from real writing). No more opportunistic, disconnected research. The sampling gave us factors and their ranges bottom-up; from here the work is top-down: enumerate each layer's parts and fill the coverage matrix below deliberately. The disconnected artifacts are mapped to their layers at the end so nothing floats.

## The generating relation (the spine)

The tool has one structure, and the research grounds it. An author is not a fixed point in style-space; the corpus shows authors visiting several modes and inflecting each by intent. So the structure is a three-tier generating relation, not a list of parts:

- Factors: the measurable atoms of a voice (cadence, opener character, diction, and the rest). Grounded: calibrated across roughly thirty-six writers.
- Modes: named, recurring regions in factor-space; a piece either sits in a mode's region or it does not, so a mode is falsifiable, not a vibe. Grounded: within-author mode-switching is pervasive (Petersen runs opener concentration at 6.9 percent in one mode and 29.8 in another; Mollick, Oster, and Tina He all swing).
- Copybook (an author): an author is their repertoire of modes, plus how they inflect each, plus their switching logic (context and intent selecting the mode). Forced by the switching finding, not invented: if an author visits several modes, then "the author" just is that repertoire and its switching.

Everything else in the tool is an operation on this relation. The operations are labeled below for what actually grounds each, so the engineering scaffold never wears the authority of the research.

## The layers, as operations on the spine

The five below map one-to-one to the coverage matrix. Each carries the grounding label that says why it exists.

1. Compensation, Layer 1 (a research-forced floor): neutralize the generator's own measured pulls before aiming. The pulls are a research fact, measured on the model's real writing; that they must be corrected first is the ordering that fact forces, since the generator cannot hit a target it is biased away from without first correcting its bias.
2. Targeting, Layer 2 (the spine in use, research-grounded): select the mode by context and intent, inflect it by the copybook, add the author's signature moves. This operation is the generating relation running, not a separate structure.
3. Verification, Layer 3 (derived from the structure): because a mode is a region, "did the output land inside it" is a real membership test, so verification is the structure checking itself; the over-claim guard rides on top.
4. Interface, Layer 4, the tuning site (engineering): expose the relation as controls, primitives in the background, basic mode as presets plus live-render recognition, advanced mode as raw sliders, outliers as tonal-exception presets. A product decision, not a claim about writing.
5. Process bounds, Layer 5, ORE, CRAFT, STRUCK (engineering, imported): run an independent agent legibly and non-self-adjudicated. Imported from the standards corpus, not derived from the writing data.

## Coverage matrix

Status key: IDENTIFIED, then OPERATIONALIZED, then CALIBRATED. Where a part is only named, it is a label, not yet research.

### Layer 1: Compensation (pull-bias)

- The per-model pull set (which factors the model over-produces). MEASURED 2026-08-31 on 108,000 words of the model's real writing (this thread's assistant output, extracted from the transcript). Real pulls, in order: expression lock-in ("is exactly" x79, "not just" x58); opener-monotony ("the" opens 16 percent of sentences, 894 of them); filler leak (0.91 per thousand of the banned words despite the ban). "Rather than" is 2.6, elevated for a human but inside the range (below Christine Kim's 2.88), so a pull to soften, not a discriminator. Em dash near zero (the ban holds). The structural template pulls (bolded-claim-plus-tail, agreement tails) are real but not yet measurable, which is the operationalization gap. OWED: build a compensation counter per pull; keep the profile per-model and re-measure across model versions.

### Layer 2: Targeting (the copybook factors and modes)

The factor inventory. Fourteen factors; the last four are not yet in the copybook-format doc.

- Cadence (sentence-length variety). OPERATIONALIZED (sentence length and its variability). CALIBRATED: a confirmed independent dimension (PC2 in the derivation).
- Sentence architecture (subordination vs coordination). OPERATIONALIZED open (needs a clause-depth measure). CALIBRATED partial.
- Boundary discipline (withholding terminal punctuation, run-ons). OPERATIONALIZED partial (words per sentence-boundary). CALIBRATED (Irby extreme). NOT in inventory doc.
- Sentence-length bimodality (long and short coexisting). OPERATIONALIZED open. CALIBRATED (Lockwood). NOT in inventory doc.
- Opener character. OPERATIONALIZED yes. CALIBRATED (4 to 100, mode-relative).
- Punctuation character (dash density, all dashes). OPERATIONALIZED (all dash forms counted in tuned-derive). CALIBRATED (0 to 69).
- Punctuation-substitution (escalating marks, caps). OPERATIONALIZED open. CALIBRATED (Irby). NOT in inventory doc.
- Coinage / neologism density. OPERATIONALIZED open (needs a novelty heuristic). CALIBRATED (Rao). NOT in inventory doc.
- Diction and concreteness. OPERATIONALIZED as concrete-anchor density (share of words scored 4 or higher on Brysbaert), NOT a mean (the mean is flat across pieces; the anchor share varies sevenfold). CALIBRATED: its own independent dimension (PC3, the concrete-versus-abstract axis). The anchor-density primitive doubles as the form-in-totality substance gate.
- Argument structure (claim, frame, prove, translate). OPERATIONALIZED partial (judgment-based beats). CALIBRATED open.
- Antithesis (as a device, not a tell). OPERATIONALIZED yes. CALIBRATED (human up to 5.6, above the model, so not a tell).
- Repetition / phrase lock-in (set-level). OPERATIONALIZED yes. CALIBRATED partial.
- Tone. OPERATIONALIZED as a stance-primitive vector: formality (Heylighen-Dewaele F-score), valence and arousal (NRC-VAD), certainty (Hyland hedge vs booster), engagement and attitude (Hyland). Grounded in Du Bois stancetaking, Russell affect, and Heylighen-Dewaele formality; surfaced in basic mode as Nielsen-Norman-style sliders. See Copybook Format section 6. CALIBRATED: measured across the 163-piece corpus with the real F-score (an NLTK part-of-speech tagger) and the Hyland and NRC-VAD lexicons. Formality coheres on the master axis (PC1); warmth and energy are their own dimensions (PC6, PC7); certainty is stance-marking (PC5); engagement is its own (PC8). Note, from the derivation: tone is a user-facing dial, NOT one empirical dimension; its primitives spread across five of them, which is why dials are a curated surface over the derived dimensions, not equal to them. Humor has no mechanical primitive; it stays exemplar-anchored.
- Register range. OPERATIONALIZED open. CALIBRATED (voice as a range).
- Signature moves. OPERATIONALIZED open (per-author). Not a general column.
- Banlist stance. A concern-model override, retirable once the engine is solid.

Modes: DERIVED by clustering the 163-piece corpus (see Derivation). Expository-analytical and confessional-reflective are confirmed and are the primary divide; a neutral middle is the largest region; creator-punchy, lyrical-literary, and polemic-combative do not form distinct clusters (creator-punchy appears only as single-author outliers). Modes are soft regions on a continuum, not tight bins. RULING (2026-08-31): hold the named set open pending a broader corpus (fiction, reportage) that tests whether the three unconfirmed modes appear when their writing is sampled.

OWED for Layer 2: the higher-order primitives are now BUILT (within-piece concreteness, warmth, and energy swings, and opener uniformity), so signature moves and form-in-totality are measurable. Tone, diction, cadence, and the modes are derived. Still owed: a coinage-novelty heuristic, argument-structure operationalization, and register-range; and a broader corpus for the mode ruling. A copybook is only a configuration over this shared space (deltas plus repertoire plus switching); it owns no factors. See Copybook Format section 2.

### Layer 3: Verification (STRUCK)

Verification runs at two scopes. See TUNED - Architecture for the full model.

- Local verification (unit scope): each primitive landed in its target, pass-or-fail for a hard preference and tolerance for mode-membership; the over-claim guard; the conforming record. IDENTIFIED. OPERATIONALIZED open. OWED: spec the output-side checks and the record format.
- Totality verification (set scope): form-in-totality, three checks, all resolving to an interview rather than a silent flag or auto-fix. The uniformity wall (the set of units must not collapse to one shape; craft-literature grounded, NOT burstiness; threshold parameterized by context). Per-dial alignment with the form (does the form match the dials; a mode is the co-occurring bundle, so alignment is mode-fit across scopes; per-dial not aggregate; unintended contrast is a fault, deliberate is a signature). The substance-and-anchor gate (does the whole deliver the concretes its form promises; the presence gate the tool diagnoses and the human fills). The discrepancy signal is a conjunction, never one metric (form-promises-concrete AND abstraction-high AND no-anchors); reader comments are the ground truth. IDENTIFIED and specified. The global primitives are now BUILT (concrete-anchor density, opener uniformity, the within-piece swings). OPERATIONALIZED open for the verification LOGIC: the region-membership test, the interview trigger, and a judge for the residue are not built. OWED: wire the built primitives into the checks and the interview.

### Layer 4: Interface (the tuning site)

- Which factors are live-render sliders (the mechanical ones) vs exemplar-anchors (the judgment ones, until operationalized). IDENTIFIED (the split). OPERATIONALIZED open.
- The live-render mechanism (checker plus generator re-running as sliders move). Not specced.
- The export copybook schema the assistant consumes. Partial (the Kaguura copybook JSON is a seed). OWED: the site architecture, the slider-vs-exemplar assignment, the export schema.
- PRIMITIVES ARE BACKGROUND. The detailed factor measurements (the percentages and linguistic primitives) are the engine, not the default surface. A normal user never tunes a raw percentage.
- TWO UI TIERS. Basic mode: high-level controls only, the modes as presets plus discover-by-recognition on the live render, primitives hidden. Advanced mode: the primitives themselves exposed as tunable sliders for the geeky users who want them. Both tiers hold on the website and inline when a copybook drives an AI assistant, so neither view is precluded.
- PLAIN-WORD SURFACE, AND A SEPARATE WORD BAN. The two tiers split on vocabulary as well as control count. Basic mode uses only words a user already owns: tone, and its plain dimensions (warm, formal, confident, reader-directed). Discover-by-recognition depends on this, the labels have to already be the user's. Advanced mode exposes the individual primitives, but still under clean plain names (energy not arousal, warmth not valence); the raw connotation-laden technical terms never surface in either view, they stay in the code and the instrument citations. So hiding a measure is the tier, banning a bad word is the naming rule, and the two are independent. Naming rule: a basic-mode control must be a word the user would use unprompted; if it needs explaining, it belongs in advanced.
- OUTLIER TONAL EXCEPTIONS. The unique-voice outliers (Popova maximalist, Graham aphoristic, Irby run-on, Rao coinage) are selectable as tonal exceptions, available even in basic mode, so a user can pull a factor to an extreme to match a named voice. The microscope voices serve twice: they calibrate the primitive bounds, and they become the extreme presets.
- OWED: the basic-versus-advanced split, the preset and outlier-exception library, and which primitives surface in advanced.

### Layer 5: Process bounds (ORE, CRAFT, STRUCK)

- Input legibility (ORE), independence and non-self-adjudication (CRAFT), output record (STRUCK). OPERATIONALIZED at first-draft depth in the spec. Least owed of the five.

## The disconnected artifacts, mapped to layers

- The derivation pipeline (tuned-derive, tuned-pos, tuned-conc, tuned-curate, tuned-modes, in the ~/code/tuned repo): the Layer 2 calibration engine, BUILT. Measures 34 primitives across the corpus, runs the factor pass, and clusters the modes.
- The corpus: durable at ~/code/tuned/corpus (163 pieces, gitignored), no longer scratchpad-bound.
- tuned-check.mjs: Layer 1 compensation checker (flags the model's own pulls). Still to be reconciled with the derived primitives.
- Median-Pull Inventory v0.3.0: Layer 1 content.
- Copybook Format: Layer 2 factor inventory (missing the four microscope factors).
- Modes doc: Layer 2 presets.
- Calibration Corpus Results: Layer 2 calibration (the ranges and the corpus data).
- Kaguura copybook: a Layer 2 instance and a seed of the Layer 4 export schema.
- Specification: Layer 5 process bounds.
- The tuning site: Layer 4, not built.

## How to work from here

The Layer 2 research is largely done: tone, diction, cadence, punctuation, the higher-order dynamics, and the modes are all derived and measured. What remains is the product, not the research. Priority open items across the whole plan, in rough dependency order: the generation loop that turns a dial target into text that hits it (Layer 4, the central engineering risk); the tuning site and the export copybook schema (Layer 4); the copybook capture, the ingestion and interview that produces a copybook (Layer 2 to 4 bridge); the verification logic and interview trigger over the built primitives (Layer 3); a license-clean runtime scorer that computes the primitives without shipping the lexicons; and a broader corpus (fiction, reportage) for the mode ruling. The still-open factors (coinage, argument structure, register range) are refinements, not blockers.
