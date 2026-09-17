# TUNED Copybook Format

Version 0.1.0 | 2026-08-31 | draft for the author's pass

The whole model is stated in TUNED - Architecture (0.2.0); this doc is the copybook's own structure, where a copybook is only a configuration over the shared space.

The general, reusable structure for one copybook. A copybook captures one author's or one register's distinctive target voice, the uniqueness TUNED aims at, measured against the general human baseline. The format is general so any author can be forked into it; the content is specific so it captures what makes that author theirs. Order is fixed: compensate the model to the de-biased base first, then aim at a copybook.

## The two layers this sits inside

- The general baseline (shared, not owned by any copybook): the human envelope and the model's compensation pulls, measured across a broad spread of writers. This is what is common. As of the current corpus, the one cross-register model pull that separates AI output from the whole human range is "rather than" density; opener concentration, em-dash use, short-sentence share, and antithesis are all register- or first-language-confounded and therefore belong to the copybook, not the baseline. The banlist (filler words, em dash) is retirable scaffolding, not a baseline fact, since fluent humans use those words at low density.
- The copybook (per-author, the uniqueness): what a specific author does differently from that baseline. Everything below specifies one copybook.

## 1. Identity and purpose

Name; exemplars (the measured samples and their sources); register or registers; scope (public writing only, the private-to-public crossing is the trigger); what this voice optimizes for; what it trades away.

## 2. The distinctive profile (the uniqueness, and the heart of the copybook)

Where this author sits relative to the baseline. A copybook is only a configuration over the shared space: the author's values (deltas from the envelope) on the shared factors, the repertoire of modes they visit, and their switching logic. It introduces no factors of its own, which is what keeps every author comparable, every copybook portable and forkable, and the export to an assistant compact. The profile is not absolute numbers alone but the deltas: which features they push above or below the general envelope. Derived by running their exemplars through the checker and reading them against the corpus.

The factor inventory (the general list of what characterizes a voice; the copybook records this author's value on each, and the deeper factors carry their own method sections below). These are the copybook's raw material, and they are distinct from the detection discriminators ("rather than" density and opener monotony), which sort AI from human but do not build a voice:

- Cadence: sentence-length variety and rhythm, the contrast between long and short and the deliberate placement, as a target range (long-subordinated academic, punchy creator, lyrical). Never a variance metric. Method in section 3.
- Sentence architecture: subordination versus coordination, nested versus flat, how a sentence is built rather than only how long it runs.
- Opener character: how sentences begin, the concentration and the word choice, set to the author's own measured range, since concentration is register-relative and strong writers legitimately run high.
- Punctuation character: the em-dash habit and other marks, set to actual usage (heavy, light, or register-variable within the author's own work), since the dash tracks style and editing, not authorship.
- Diction and concreteness: where on the abstraction ladder the writer lives, granularity, register vocabulary. Method in section 4.
- Argument structure: how they build a case (claim, frame, prove, translate) and the problem-to-gain arc. Method in section 5.
- Register range: the span they work across, since a voice is a range, not a point.
- Tone: their characteristic stance and affect, axes derived from their own exemplars. Method in section 6.
- Banlist stance: which otherwise-banned words they use naturally, and at what rate, the evidence for relaxing the scaffold into a band for this copybook.

Signature moves are not additional factors. A move like a revelation frame, or a high-register claim landed with a vernacular hammer, or pedagogical triads, is a higher-order pattern: a sequence, a contrast, a co-occurrence. It lives in the shared space too, provided that space carries more than scalar averages, namely within-piece variance of a dial, transitions and contrasts across sentences, and co-occurrence of features. Given those primitives, a signature move is a named compound-configuration, a recognizable region of the shared space, kept named only for human legibility; it adds no dimension the copybook owns. The one residue, a genuinely one-off device with no recurring statistical signature, is handled the way humor is: an exemplar-anchor pointing at the sample to reproduce, which is a reference, not a factor. So the copybook stays purely a configuration.

## 3. Cadence

Sentence-length variety by deliberate contrast, the long sentence placed only after short ones have rested the reader, tested by ear (Provost, Clark, Le Guin, Williams). The author's characteristic distribution from section 2 is the target. Never a variance metric.

## 4. Diction and concreteness

The ladder of abstraction and granularity (state the abstraction once, then descend to a real specific; Hayakawa, Heath). The author's concreteness level as target, measured as anchor density (the share of highly-concrete words on the Brysbaert norms), not a mean: the mean is flat across pieces while the anchor share varies sevenfold, so anchor density is what discriminates. The within-piece swing of concreteness is the ladder itself, whether a piece moves from the abstract down to the concrete or stays flat.

## 5. Structure and moves

The general scaffold is the argument grammar from the concrete-abstract copy playbook: claim, frame, prove, translate, with the frame being the beat most writing skips. Layered on top are the author's signature moves from section 2. The register arc (name the problem, then resolve on the gain) applies where the piece argues.

## 6. Tone

Tone is the writer's stance: their attitude toward the subject, toward the reader, and toward the text itself. The research converges on stance as the umbrella construct (Du Bois's stance triangle, operationalized computationally by Pavalanathan and colleagues), and stance decomposes into measurable primitives drawn from three validated instruments. These are not an unvetted voice framework; each primitive is an independently validated measurement tool, and the corpus can still refine them (see the derivation note).

Tone operationalizes as a small vector of stance primitives, grouped by which leg of the stance triangle each measures.

Toward the text (how explicit or context-bound):

- Formality, or contextuality. The Heylighen-Dewaele F-score, from part-of-speech ratios: nouns, adjectives, prepositions, and articles raise it; pronouns, verbs, adverbs, and interjections lower it. Mechanical. High is detached and explicit, low is involved and implicit. This is the master axis, the single largest dimension of stylistic variation across languages.

Toward the topic (affect and commitment):

- Warmth. Mean valence over matched words from the NRC-VAD lexicon (the valence norm, surfaced as warmth; 20,000-plus words scored 0 to 1). Cold or bitter to warm or affirming.
- Energy. Mean arousal from NRC-VAD (surfaced as energy), plus mechanical amplifiers already countable in the checker: intensifier density, exclamation rate, capitalized runs. Calm and measured to heated and urgent. Warmth and energy are the two axes psychology treats as primary affect (Russell's circumplex); the technical names valence and arousal stay in the background, never on the surface.
- Certainty, or epistemic stance. Hedge density against booster density, from Hyland's interactional metadiscourse lists (hedges: may, might, perhaps, seems; boosters: clearly, in fact, definitely). Tentative to assertive.

Toward the reader (interpersonal):

- Engagement. Hyland engagement-marker density (you, consider, note, imperatives, questions) with self-mention density (I, we, my). Detached and impersonal to reader-directed and personal.
- Attitude. Hyland attitude-marker density (unfortunately, surprisingly, remarkable, agree): the explicit-evaluation channel.

Two of these are fully mechanical and drop into the checker now (formality, energy amplifiers); the rest need a published lexicon loaded once (the Hyland lists and the NRC-VAD norms). The primitives overlap slightly (formality and engagement both read pronouns) and are kept separate because they are separately instrumented and separately tunable.

Two tiers decide what surfaces, and a naming rule decides what is speakable. In basic mode the user sees a few recognizable sliders, following the validated practitioner cut (Nielsen Norman's tone-of-voice dimensions): formal to casual (the formality primitive), warm to neutral (warmth with energy), confident to tentative (the certainty primitive), and reader-directed to detached (engagement). In advanced mode the user sees the individual primitives themselves, exposed and tunable, so the primitives are hidden from the basic view, not from every user. The naming rule cuts across both tiers: every primitive is shown under a clean, plain name (warmth, energy), and the connotation-laden technical terms (arousal, valence) never surface in either view; they live only in the code and the instrument citations. What is hidden from everyone is the bad word, not the measure. Both tiers hold on the website and inline when a copybook drives an AI assistant, so neither view is precluded. Humor, Nielsen Norman's fourth dimension, has no reliable mechanical primitive and stays exemplar-anchored rather than a slider.

Derivation note, on whether to import or derive. The primitives above are validated instruments, so using them is not importing a vibes-framework. Where the corpus should have the final say, Biber-style multidimensional analysis (factor-analyzing these features across our authors) can confirm the axes, or collapse and split them, turning imported instruments into corpus-grounded dimensions. That factor analysis is the vetting step, run against the instrument rather than instead of it.

## 7. Preferences (cross-register, copybook-relative)

The author's cross-register dispositions: the parameters they carry across all their modes, as opposed to the per-mode inflections in section 2. Em dash: banned, allowed, or register-variable, per the author. Filler tolerance: the density of otherwise-banned words this voice carries naturally. Each copybook sets its own, because these are author-relative, not universal. This is where the em-dash flip lives: banned in the standards copybook, wanted in the creator one.

Preferences run on a spectrum. A hard preference is a near-constant (no em-dash, in every register, near-zero variance). A soft preference is a disposition with a consistent direction whose intensity is scaled by context (a writer who drops punctuation to the extreme in a blog and mildly in an email). A soft preference composes with the mode, which can amplify or damp it; a hard preference that conflicts with what a mode wants takes precedence. Preferences are the author's stable core, the part that reads as them regardless of context.

## 8. The avoid-list

Shared, from the baseline: set-level structural repetition (unvaried symmetric repetition, saturated parallelism and tricolon, the aphoristic or fake-profound kicker; the tell is the repeated pattern, not the single instance), plus the model's compensation pulls ("rather than," opener monotony beyond the author's own range). Specific: any tell this author is personally prone to. Never sentence-length variance, which is retired as folklore.

## 9. Conformance

What a conforming run to this copybook produces and how it is checked from the run's record: the output sits inside the author's distinctive-profile ranges (section 2), executes the structure (section 5), respects the overrides (section 7), and avoids the tells (section 8). Adapted from the copy playbook's pass-or-fail test pattern.

## 10. Machine-readable form

Every copybook element wears two faces on one primitive: a prose meaning the user recognizes, and a generation approach the assistant follows, hinged on the primitive that both drives generation and, read the other way, verifies. So the machine-readable form is generative, not only evaluative: it carries generation approaches, instructions to follow, not just targets to hit.

A JSON block carries, per element: the primitive and its target range (which the checker consumes to verify), and the generation approach, which comes in three flavors. By-instruction for dials and primitives (prefer formal parts of speech, add hedges, descend to concretes; for a derived dial, turn its loading primitives). By-pattern for signature moves (a sequence recipe, such as open high-formality and drop to vernacular at the close). By-example for the residue and the exemplar-anchors (emulate this sample, where no instruction captures it). This is the interface between the copybook and the tool, and it is what closes the loop from a target value to text that hits it.

## 11. Provenance and firming

The exemplars measured, and how to firm each range: more exemplars per author turn a single point into an envelope. A copybook built on one exemplar is provisional and says so.

## Open for the author's pass

- Whether the distinctive profile (section 2) should read as absolute ranges, as deltas from the baseline, or both.
- The tone-derivation method (section 6): how to extract axes from exemplars rather than assert them.
- How the copybook-aware checker reads the section 7 overrides and the section 2 ranges, which is the build that wires the tool to the copybook.
