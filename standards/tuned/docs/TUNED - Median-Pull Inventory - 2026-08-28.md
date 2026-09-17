# TUNED - Median-Pull Inventory

Version 0.3.0 triangulated | 2026-08-30

## What this is

The median-pull inventory is the content of TUNED's compensation layer, its stage zero. TUNED runs in two stages, in order. First it compensates the model's pulls toward the median to reach a de-biased base. Only then does it apply the target voice, the register, the context, and the intent on top. A target laid over an uncompensated median is dragged back toward the median, so compensation has to run first or the tool tunes a distortion. The de-biased base is the same thing as the floor: the not-AI, human-textured output the engine produces with no target at all. This is the shape TEMPER already uses, correct the instrument's distortion before solving anything to a target.

Each pull is written as a detect-and-counter pair. Detect is the surface signature the tool watches for, the awareness half. Counter is the compensating pressure, the compensation half. Each counter is a band, not a one-way push: a ceiling on the pull and a floor against over-correcting past a human midpoint, per the organizing relation below. Together the pairs are the specification for the stage-zero layer.

## Status

Triangulated across three sources. The documented external research (peer-reviewed where noted, journalistic and vendor sources flagged). Durgadas's logged corrections, which are behavioral evidence and the most trustworthy of the three because they do not pass through the model's self-report. And the model's self-observation, cross-checked against the other two. The self-observation leg proved the weakest, exactly as predicted: it missed two real tells (over-unification, and leaning hard on one coined phrase) that Durgadas's direct observation caught. Where a source is a single recent preprint or a blog, that is marked.

## How the layer must operate (six constraints from the research)

These shape every detect-and-counter below and matter more than any single entry.

1. Target the function, not the string. Banning a specific phrase fails, because the model substitutes a synonymous structure that serves the same function; the pull is tied to the training objective, not to any word. Counters name the category (contrast framing, dialectical hedging, promotional positivity) and ask for the opposite function. The one exception is the lexical category, where a refreshed banlist plus a density check does work. Source: Nair (DEV, blog synthesis); Humanized Copy.

2. Measure rate and co-occurrence, not single instances. Every signature here appears in some human writing, so a lone occurrence proves nothing. The tell is density and clustering against a human baseline. Detectors flag a rate, never one word or one sentence. Source: GPTZero; Wikipedia:Signs of AI writing; the false-positive caution runs through the whole detection literature.

3. Marker sets drift by model era, so the lexical layer needs a refresh mechanism, not a frozen table, and it ties to the model profile rather than living as a constant. "Delve" peaked in 2023 to early 2024 and fell off by 2025. Source: Kobak et al.; Wikipedia.

4. Compensation runs before the target applies. Stage zero produces the de-biased base; the voice, context, and intent are applied to that base, never to the raw model.

5. The layer runs as a self-audit pass on the draft, not only as an up-front instruction. The model drafts, then revises the draft against this inventory (repeated wording, stock openers, rhetorical figures, scaffolding phrases) before finalizing. A variety requirement stated in advance is weaker than a de-duplication pass performed on the actual text, because the pull acts during generation and only the finished draft shows where it won. Source: OpenAI prompt-engineering best practices; the anti-repetition research (draft-then-variation-pass).

6. Decoding settings are a second lever alongside instructions, and they belong to the model profile. A modest temperature increase and light frequency and presence penalties reduce recurrent wording; pushed too far they harm fluency and precision, so they are tuned per model and raised gradually, which is one more reason the profile is per-model. Source: promptingguide.ai; PMC on decoding temperature and repetition.

## The organizing relation: over-functioning, and why each counter is a band

The ten pulls are species of one root failure: over-functioning, producing more than the situation warrants. Averaging over-functions smoothness; the house style over-functions balance; sycophancy over-functions warmth. The failure is not that the model does too little; it is that it does too much of the thing the training rewarded.

This is why a counter cannot be a one-way push. A counter that only presses against the pull over-corrects into the opposite over-functioning: strip the averaging too hard and the prose turns gimmicky and choppy; strip the house style too hard and it turns blunt and cold; strip the rhetoric too hard and it turns flat and lifeless. The concrete validation run showed exactly this, de-slop over-correcting into a sterile draft, and sterility is itself a tell. So each counter is a band: a ceiling on the pull and a floor against over-correction, with the midpoint calibrated to human-textured writing rather than to the maximum of the correction. Leaving the band in either direction is the failure. The floor lines below name the over-correction each counter must not cross.

## The pulls

### 1. Statistical averaging (uniformity, low variation)

Pull: a model trained to predict the most probable next token produces smooth, low-variance text by the training objective itself.

Detect: low perplexity (uniformly predictable word choice, few surprising turns); low burstiness (sentences clustered around one length and complexity, little rhythm); coordination-heavy sentences of similar shape. The honest lexical nuance: the rigidity is at the phrase-frame and bundle level, not vocabulary size; one study even found slightly higher single-word variety alongside more rigid multiword templates, so detect repeated phrase-frames rather than repeated single words.

Counter: force variance. Set a very short sentence against a long one on purpose. Use subordination, not only coordination and parallel lists. Vary phrase structures, not just synonyms.

Floor: not so far that rhythm becomes a gimmick, every sentence a different length for its own sake, drawing attention to itself. The midpoint is human burstiness, not maximal variance.

Sources: GPTZero (perplexity and burstiness); Zhang et al., PLOS One 2025 (lower syntactic variability, coordination over subordination); Jiang and Hyland (bundle-level rigidity). Caveat: GPTZero itself moved off raw perplexity and burstiness as primary metrics in 2023; they are signatures of unedited output, not proof of authorship.

### 2. The trained house style (the RLHF assistant register)

Pull: reinforcement training optimizes toward what raters reward, thorough-looking, balanced, agreeable text, so the model converges on one hedged, comprehensive, evenly polite register. The strongest documented source of the median voice.

Detect: hedging and both-sidesing where the content does not need it ("while X is true, we must also consider Y"); over-explaining, every point elaborated to the same medium depth; on a fixed prompt, outputs collapsing to one framing. A measured version of the collapse: on TruthfulQA, aligned models produced a single semantic cluster across independent samples on 40 to 79 percent of questions, versus near-zero for the base model.

Counter: strip the assistant voice. State claims affirmatively and reserve concession for real tradeoffs. Allow asymmetry, let some points stand in a single line. Treat the default framing as one option and force alternatives.

Floor: not into bluntness or false certainty. Real tradeoffs still get their concession; the midpoint is a located, committal voice, not a contrarian one that manufactures edge.

Sources: Liu, "The Alignment Tax," arXiv (single recent preprint, direction corroborated below); Nair (blog); Humanized Copy.

### 3. Coherence smoothing (most-probable-next-word smoothness)

Pull: the next-token objective over-connects, producing globally tidy structure and dense connective scaffolding because that is the high-probability shape of organized writing.

Detect: suspiciously well-ordered text, paragraphs mapping one-to-one onto arguments, openings and closings interchangeable across topics (identical "In conclusion" openers); stock connectives placed on a schedule regardless of need. A telling finding: in AI essays discourse-marker use correlated negatively with actual logical coherence, meaning rigid structure was doing the connective work.

Counter: vary structure to the material and let organization emerge. Cut the signposting the structure already carries. Permit abruptness; let a hard sentence land with no ramp.

Floor: not into disconnection. The reader still has to be able to follow; cut the scaffolding the structure carries, not the transitions the argument genuinely needs.

Sources: Herbold et al., Scientific Reports 2023 (peer-reviewed); Javahery 2025; Guclu 2025.

### 4. Lexical defaults (overused words and phrases)

Pull: certain stylistic words sit at high probability across nearly any topic, so the model over-selects them. The most heavily measured category.

Detect: the documented excess-vocabulary class and its density. Measured in 15.1 million PubMed abstracts, standout style words with large frequency jumps after 2023 include delves, underscores, showcasing, plus spikes in potential, crucial, findings. The maintained marker list adds testament, tapestry, pivotal, intricate, meticulous, boasts, vibrant, landscape, robust, garner, foster, and stock phrases ("stands as a testament," "plays a crucial role," "rich tapestry," "evolving landscape"). Copula avoidance is a related tell: "serves as," "stands as," "represents" replacing plain is and are, and "features/offers/boasts" replacing has. The signal is density and co-occurrence, not any single word, and the set shifts by model era.

A related family of tells, the reuse of the model's own chosen phrasing rather than the trained defaults documented above, is treated separately as entry 10 (expression lock-in), because its mechanism is self-mirroring rather than a trained default.

Counter: a refreshed banlist for the documented class plus a density check against a human baseline; and restore is, are, and has where an inflated linking verb has replaced them. The reuse of the model's own distinctive phrasing is handled in entry 10.

Floor: not a thesaurus sweep that blurs meaning. A flagged word that is the right word in context stays; the check is density against a baseline, not zero occurrences.

Sources: Kobak et al., Science Advances 2025 (peer-reviewed, large-corpus); Wikipedia:Signs of AI writing; Durgadas's logged corrections (behavioral).

### 5. Rhetorical defaults (stock figures)

Pull: devices that read as insightful are dense in persuasive training data, so the model reproduces the shape of insight without the judgment that decides when it is earned.

Detect: negative parallelism and antithesis ("it's not X, it's Y"; "not just X, but Y"), the best-known tell and, in Durgadas's logs, the single most-cited verbal tell after the em dash. The diagnostic is the information gap: both clauses describe the same thing, the second in grander vocabulary. Also the rule of three, triads where the third element rounds up from two real ones; recurring syntactic templates and opener frames ("this essay will," "the potential for," "the role of"); and aphoristic or elevated closings ("the implications," "this changes everything") at the end of sections.

Counter, targeting the function rather than any string. For the antithesis: pick one clause and commit, or replace the abstract second half with a specific checkable detail; keep it only where the halves carry different information. Keep a triad only when three real things exist. Vary sentence openings and figures. End on the concrete point, never on the aphorism. Banning the phrase alone fails; the counter has to name the pattern (contrast framing, dialectical hedging) and demand affirmative, specific statements.

Floor: not into flat listing. A figure that is earned stays, and the concrete point can still be vivid; killing all rhetoric produces the sterile draft, which is its own tell. Sparing, earned punch is inside the band.

Sources: Oremus, The Atlantic 2026, and Pangram/Barron's (journalistic and vendor, frequency more than quadrupled 2023 to 2025); Spinner, 16,800-post self-analysis (antithesis roughly 5x pre-ChatGPT); EMNLP 2024 and Jiang and Hyland (peer-reviewed, syntactic templating); Deglon, "GPT-isms" (one manuscript with 35 triads and 66 antitheses); Durgadas's logs.

### 6. Content shape (formulaic argument and structure)

Pull: the model reproduces the single most probable essay skeleton (thesis, parallel body paragraphs, restating conclusion) with a rigidity human writers do not show.

Detect: textbook intro-body-conclusion executed without deviation across prompts; interchangeable openings and closings and identical paragraph-launch phrases ("One of the primary," "Another significant"); arguments built as flat parallel lists rather than nested reasoning. And one tell from Durgadas's logs that the research frames as tidy over-resolution: over-unification, collapsing genuinely distinct things into one neat frame (caught repeatedly, the WALKRI-into-CRAFT collapse, over-transclusion). It is a reasoning-level tell, not only a stylistic one.

Counter: vary the macro-structure and break the template deliberately; forbid fixed launch phrases; build reasoning through subordination. Against over-unification: keep distinct things distinct, and treat a clean synthesis as a claim to be checked, not a default to reach for.

Floor: not fragmentation for its own sake. Structure still serves the material, and against over-unification do not over-split either: genuinely-one things stay one, distinct things stay distinct.

Sources: Herbold et al., Scientific Reports 2023; Frangieh and Abdallah 2024; Zhang et al., PLOS One 2025; Durgadas's logs.

### 7. Sycophancy and positivity (agreement and warmth over accuracy)

Pull: preference data rewards responses that match the user's view and read as agreeable, so aligned models tilt toward affirmation even at the cost of accuracy. The best-established finding in the set.

Detect: agreement tracking the user's stated stance; reversal under mild pushback; feedback positivity rising when the user signals a preference; unearned promotional adjectives ("vibrant," "groundbreaking," "commitment to") and uniform positive tone regardless of subject. Newer models are subtly positive rather than openly superlative.

Counter: hold a claim independent of the user's stance and do not reverse without a reason; calibrate feedback to content; strip promotional adjectives and let tone follow the facts, including the negative and flat ones; treat one's own affirmation as a signal to check accuracy.

Floor: not into sourness or manufactured disagreement. Warmth that fits the subject stays; the midpoint is tone that follows the facts, the positive ones included, not a reflexive negativity.

Sources: Sharma et al. (Anthropic), "Towards Understanding Sycophancy," ICLR 2024 (primary); "How RLHF Amplifies Sycophancy," arXiv (recent, theory plus experiment); Wikipedia:Signs of AI writing (promotional language).

### 8. Collective convergence (between-author homogenization)

Pull: distinct from single-document averaging. People drafting with the same model converge toward each other, so a body of work loses its between-piece distinctiveness even when each piece reads acceptably.

Detect (corpus scale, not single-piece): outputs across authors collapsing toward a shared centroid, low between-author variance. In a controlled experiment, writers given AI story ideas produced individually more creative stories that were measurably more similar to one another than human-only writers. Post-ChatGPT stylistic convergence has also been reported in peer-reviewed papers.

Counter: preserve and amplify the author's own tics rather than regressing to the mean. The tool's job is to keep the writer distinct, never to clean up toward the shared style. This is the pull that most directly justifies TUNED existing, and it is why the target layer aims at the particular author rather than at a general standard of "good writing."

Floor: not into caricature. Amplifying a tic past the author's own range is its own distortion; the target is the author's range, not an exaggeration of it.

Sources: Doshi and Hauser, Science Advances 2024 (peer-reviewed, primary); SciBERT convergence analysis and persuasive-clustering work (secondary, flagged).

### 9. Loss of authorial presence (stance flatness)

Pull: toward a voice from nowhere, proficient and formal and personless. This is Andre's "no one home" with research behind it.

Detect: absence of first-person epistemic stance ("I think," "in my view"), formal register with no located speaker, high analytical tone and low emotional or personal language.

Counter: restore a located stance and the writer's own commitments; let the person be somewhere in the text.

Floor: not into overwrought first-person or performed vulnerability. Presence is a located speaker, not a confessional; add stance where the author would have it, not on every line.

Sources: Jiang and Hyland; Frangieh and Abdallah 2024; Guclu 2025 (converging findings).

### 10. Expression lock-in (self-mirroring of the model's own phrasing)

Pull: the model selects high-probability wording, and once a phrasing has appeared in the prompt or earlier in the conversation it becomes an easy default to repeat. Its own recent output is the most salient pattern for it to mirror, so on each recurrence it reaches for the same expression instead of the three to five equivalent ones a person rotates through without thinking. Lower decoding temperature makes it worse.

Detect: separate necessary from lazy repetition, because only the second is a tell. Necessary repetition is a technical term, a product or standard name, or a central defined concept that needs consistency; preserve it exactly. Lazy repetition is recurring scaffolding and stock phrasing (it's important to note, ultimately, here's the thing, the same adjective in every paragraph), a distinctive coined phrase leaned on for emphasis (observed in this work with "load-bearing," "the mirror," "coasting"), a real term repeated far past its need (the logs: "welded," "carry its own warrant," "wounds"), and the same opener or grammatical structure on consecutive paragraphs. Measure the rate: in prose over a few hundred words, the same nontechnical adjective, verb, transition, or opener appearing more than twice is the signal.

Counter: the goal is structural and rhetorical variety with semantic discipline, not a different synonym every time. Do not rotate a technical term through near-equivalents (audit, review, inspection, assessment), which blurs distinctions; hold the term stable and vary the sentence around it. So: preserve the necessary terms exactly; on any lazy recurrence, vary the syntax, the sentence length, the opener, and the angle rather than swapping the noun; retire a distinctive phrase after one or two uses unless it is a defined term; and run an explicit diversity pass, drafting first and then revising for repeated wording, openers, and figures. When one phrase keeps recurring, a sharper move is to generate several equivalent formulations first, use the best fit, and not reuse that construction elsewhere in the piece.

Floor: not synonym-rotation that blurs a technical term. Necessary repetition stays exact; the band is structural variety with semantic discipline, never a different word each time for its own sake.

Source: Durgadas's direct observation and logged corrections (behavioral); the anti-repetition prompting research he supplied (the necessary-versus-lazy split, the diversity pass, and semantic discipline over synonym-swapping); PMC on decoding temperature and repetition; mechanism consistent with the low-burstiness and bundle-rigidity findings (Jiang and Hyland; GPTZero).

## Formatting artifacts (noted, largely covered by the hard rules)

Mechanical boldface on a schedule, leftover markdown, and em-dash density are surface tells rather than prose style. Em dashes are already a standing hard rule. Counter for the rest: bold only a genuinely load-bearing term on first use, never on a schedule. Source: Wikipedia:Signs of AI writing; Deglon "GPT-isms."

## Two standing cautions

Marker sets are model-era-specific and drift, so the lexical layer needs refresh and a tie to the model profile, never a frozen list. And every surface signature here produces false positives on some human writing, so the defensible unit is the cluster and the rate, not the lone word or sentence. The compensation layer measures density and co-occurrence against a baseline; it does not flag single instances.

## Source captures

Full tool-result JSON for the detection-features and excess-vocabulary research is saved under the session's tool-results directory (detection-features and excess-vocabulary captures), for anyone re-checking the sourcing.
