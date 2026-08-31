# TUNED Derivation - First Pass

Version 0.6.0 | 2026-08-31

The first real (not paper) derivation of the latent structure, run on the test-substacks calibration corpus: the sample of other writers gathered to derive the shared space, not the author's own standards corpus or PoC corpus, neither of which is in this derivation. Produced by tuned-derive.py over corpus/raw, with part-of-speech features from tuned-pos.py and the concreteness diagnostic in tuned-conc.py. Four runs stand behind it: mechanical primitives, then affect and concreteness lexicons, then the real part-of-speech F-score, and now concreteness re-measured as anchor density. This is the fourth and fullest.

## Scope and honesty

Thirty primitives. The mechanical set, the affect primitives (warmth, energy, authority, which are the NRC-VAD valence, arousal, and dominance norms surfaced as plain words), the real Heylighen-Dewaele F-score and open-class densities from an actual part-of-speech tagger (NLTK, in an isolated venv), and concreteness measured correctly this time: as anchor density and abstract-word share, not a mean. The higher-order primitives (within-piece swings and opener uniformity) are now in it too, bringing the count to 34 (see the higher-order section). Still not done: the mode clustering. Method is principal components on the correlation matrix (numpy).

## The concreteness fix

The earlier runs reported that concreteness did not form a dimension, and I attributed that to the corpus. That was wrong; it was the measure. A diagnostic (tuned-conc.py) showed mean concreteness is nearly constant across pieces (coefficient of variation about 4 percent, whether or not function words are stripped), because averaging pins every piece to the mid-scale center. The share of highly-concrete words, by contrast, varies sevenfold (1.8 to 13 percent of words, CV 38.5 percent). So concreteness is not flat in this corpus; the mean flattened it. Measured as anchor density (the count of words scored 4 or higher on Brysbaert) with abstract-word share as its other pole, concreteness now coheres. This is also the concrete-anchor construct the Courtney case pointed at, so the same primitive serves the form-in-totality substance gate.

## What is checked (computed)

148 pieces, 30 primitives. Eight components clear the eigenvalue-one bar, explaining 74.9 percent of the variance: PC1 31.4%, PC2 10.6%, PC3 8.5%, PC4 6.8%, PC5 5.3%, PC6 4.5%, PC7 4.2%, PC8 3.6%.

The F-score's own range is 46.6 to 74.7, mean 63.0, matching Heylighen and Dewaele's genre benchmarks (conversational around 48 to 53, essays and scientific 69 to 72).

Strong loadings (absolute value at least 0.30):

- PC1 (31.4%): +flesch, -formality_F.
- PC2 (10.6%): sentence length and its variability.
- PC3 (8.5%): +concrete_anchor, -abstract_share, -adj, -adverb.
- PC4 (6.8%): expressiveness, exclamation and caps and questions against article-heavy abstract prose.
- PC5 (5.3%): stance and texture, hedging and warmth against lexical variety.
- PC6 (4.5%): +warmth, +comma, +first_person.
- PC7 (4.2%): +energy.
- PC8 (3.6%): -second_person, engagement.

## What is interpreted (my reading of the loadings)

- PC1: involved-and-easy versus informational-and-dense (Biber's Dimension 1), defined by the real F-score with readability.
- PC2: cadence. Pace, its own dimension.
- PC3: concrete versus abstract, concrete-anchor density at one pole, abstract words and adjectives and adverbs at the other. Its own dimension, once measured right.
- PC4: excited-expressive versus measured.
- PC5: stance and texture.
- PC6: affective warmth. Its own dimension.
- PC7: energy. Its own dimension.
- PC8: reader-engagement.

## What it corrects in the paper model

1. Pace is a real, independent dimension (PC2). Held across all four runs.
2. Formality coheres once the tagger is real; it defines PC1 with readability. The closed-class proxy had fragmented it; that was an instrument artifact.
3. Concreteness coheres once the measure is right. It forms its own dimension (PC3, the third-largest) when measured as anchor density rather than a mean. The earlier "corpus does not exercise concreteness" was my error, a measurement artifact, not a fact about the writing. So the vividness dial is empirically real after all.
4. Tone is still not one dimension; it fragments across formality (PC1), expressiveness (PC4), stance (PC5), warmth (PC6), and engagement (PC8). The dials are a user-facing grouping over the derived substrate.
5. Warmth (PC6) and energy (PC7) are genuine independent affect dimensions.

## Extension: a technical band

To stop the space being substack-shaped, a curated academic band was added (tuned-curate.py). The referenced paper collection was mixed (real papers among guidebooks, reports, and admin), so it was curated, not used wholesale: fifteen genuine journal, article, and working-paper texts, books truncated to a 5000-word sample, references and PDF apparatus stripped, one candidate (a math lecture-notes file, mostly notation and a table of contents) excluded on inspection. The corpus is now 163 pieces, 148 substacks and 15 technical, all from other writers, still not the author's own corpus.

The band behaves as intended and validates the space three ways. It generalizes: all eight dimensions hold on the 163-piece corpus, so the structure is not an artifact of the substack register. It anchors the formal pole: the technical pieces run F-score 70.5 on average (range 64 to 76) against the substacks' 63.0, right on Heylighen's academic benchmark, and PC1 strengthens from 31 to 33 percent. And it extends concreteness to its true abstract end: the papers run 41 concrete anchors per thousand words against the substacks' 66, populating the low-anchor pole the substacks under-sampled. One note for later: the abstract-word share (words scored 2 or lower) barely separates the bands, because it is dominated by function words; the concrete-anchor count is the workhorse and the abstract share is weak.

## Higher-order primitives

The scalar primitives measure a piece's level; the higher-order ones measure its within-piece dynamics, which is what signature moves and form-in-totality live in. Four are built: concreteness swing (the standard deviation of concreteness across 60-word windows, the abstract-to-concrete ladder, low for a flat piece), warmth swing and energy swing (the same for affect), and opener uniformity (the share of sentences that begin with the single most common opener word, the every-sentence-opens-the-same collapse). With them the corpus runs 34 primitives, and ten components now clear the eigenvalue-one bar (69.5 percent of the variance).

They carry real but lower-variance signal, as dynamics should. The swings cluster together into a within-piece-variation theme (concreteness swing and warmth swing load on the same component): pieces that move across their span against pieces that stay flat. Opener uniformity gets its own home, separate from the level dials, which is the uniformity signal the form-in-totality check reads. So the primitives that form-in-totality and the signature moves need are now measured: concreteness swing is the ladder and the substance dynamic, opener uniformity is the collapse tell, and the affect swings are register-collision material.

## Modes, derived

The pieces were clustered in the top-eight-component space (k-means and silhouette in numpy, tuned-modes.py) to replace the hand-read five modes with data-derived regions.

Silhouette scores are low across all K (0.15 to 0.26, highest at K=2), which is the first result: modes are soft, overlapping regions on a continuum, not tight clusters. That matches "voice is a range." The single strongest split, K=2, divides the corpus on formal-and-detached versus personal-and-involved, the master axis.

At K=5 the stable regions are: an expository-detached cluster (high formality, impersonal, low concrete anchors, few boosters, holding most of the technical papers); a long-sentence expository variant; a confessional-personal cluster (low formality, high first-person, high concrete anchors, reader-directed, short sentences, no technical pieces); a large, weakly-distinguished neutral middle; and a four-piece single-author outlier that is almost entirely exclamation marks. Authors with two or more pieces appear in 1.6 clusters on average, so within-author mode-switching is confirmed and the clusters are cross-author regions, not author identities.

Against the hand-read five (expository-analytical, confessional-reflective, creator-punchy, lyrical-literary, polemic-combative): expository-analytical and confessional-reflective are strongly confirmed and are the primary divide. Creator-punchy, lyrical-literary, and polemic-combative do not emerge as distinct populated clusters; creator-punchy appears only as idiosyncratic single-author outliers, and a neutral middle that was not on the list is the largest region. So the data supports two robust modes plus a neutral middle plus finer sub-structure, and the five-mode cut was partly aspirational. Reconciling the derived regions with the named mode set is a normative call, left to the author.

## Next

The mode-set reconciliation is held open by decision (2026-08-31), pending a broader corpus. The five named modes stay provisional targets and the neutral middle is an observed region; the final cut waits until out-of-band registers (fiction, reportage) test whether the three unconfirmed modes appear when writing that exhibits them is sampled. Gathering that broader band is the next data step whenever it is wanted; the clustering re-runs on it unchanged.
