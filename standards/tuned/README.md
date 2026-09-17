# TUNED

The words instrument of the **DS4AI** suite. Backronym: *Tuned to the Utterance, Not the Established Default.*

DS4AI fills the layer an AI skips when it builds a website: the parts that never show in a demo. It is eight drop-in instruments under one standard, **MISSING**, which defines what a finished front end covers and ships an auditor for it. Seven instruments are build axes, each its own repo beside this one:

- **TEMPER** (perceivable) color solved to contrast floors
- **GRASP** (operable) keyboard and screen-reader controls
- **LUCID** (understandable) layered disclosure
- **GRACE** (resilient) loading, empty, and error states
- **HASP** (key-private) the user's model key stays in their browser
- **BEACON** (findable) metadata a crawler and a share can read
- **FLEET** (fast and stable) delivery tuned to the Core Web Vitals

TUNED is the eighth, the words layer beside the seven, not an eighth axis of the standard. The other instruments fix the build; TUNED fixes what the build says. It captures a writer's intent and tunes the writing to it, so a page reads as authored instead of averaged, the one thing an AI defaults to getting wrong.

## What this repo is

The empirical **derivation** behind TUNED, not yet the shipping instrument. It is the research that turns "voice" from a set of asserted labels into a measured space: it takes a corpus of real writing, measures a set of grounded linguistic primitives across it, and derives the latent dimensions, the plain-language dials, and the modes from the data rather than from taste. The shipping instrument that builds on this (a tuning site, the generation loop, a copybook export, an MCP-callable tool) is the product still to come.

The model it derives, in one breath: primitives (measurable features) group into dials (plain-language controls a user owns, like tone and pace), which cluster into modes (recurring regions of the space), and an author is a copybook, a configuration over that shared space. The full design lives in the Obsidian vault (see *Design docs* below), which is canonical; this repo is the code.

## The pipeline

Run order, once the data is in place (below):

1. `tuned-pos.py` computes the real Heylighen-Dewaele formality F-score and open-class densities with an NLTK part-of-speech tagger, and writes `corpus/pos-features.json`. Needs the venv.
2. `tuned-derive.py` measures all 34 primitives across the corpus, runs the principal-components pass, and saves `corpus/features.npz`. Plain Python plus numpy.
3. `tuned-modes.py` clusters the pieces in the derived space (k-means and silhouette in numpy) to derive the modes.

Supporting scripts:

- `tuned-conc.py` the concreteness diagnostic that showed concreteness must be measured as anchor density, not a mean.
- `tuned-curate.py` curates the technical band: extracts and cleans academic PDFs into the corpus.
- `tuned-check.mjs` the standalone mechanical prose checker (Node), the compensation-layer tool that flags a model's own drifts.

## Running it

Dependencies: Python 3 with numpy and pandas (system is fine); Node for the checker; and an isolated venv with NLTK for the tagger, because the tagger is the only heavy dependency:

```
python3 -m venv .venv && .venv/bin/pip install nltk numpy
NLTK_DATA=./nltk_data .venv/bin/python -c "import nltk; [nltk.download(r) for r in ['averaged_perceptron_tagger_eng','punkt_tab']]"
```

Then run `tuned-pos.py` under that venv, and the rest under system Python.

### Data (not in the repo)

Both the corpus and the lexicons are gitignored and must be supplied locally:

- **Corpus** (`corpus/raw/*.txt`): 163 pieces, 148 sampled substack writers plus 15 curated academic papers. It is other writers' copyrighted prose and is not redistributed. `corpus/raw/INDEX.md` documents its shape; `tuned-curate.py` records how the academic band was extracted.
- **Lexicons** (`corpus/lexicons/`): NRC-VAD (valence, arousal, dominance) and Brysbaert (concreteness). Download NRC-VAD from `saifmohammad.com` and the Brysbaert norms from their published source. **License:** NRC-VAD is free for non-commercial research and education but is explicitly *no-redistribution*, so it cannot be committed here or shipped in any product; Brysbaert's terms are not yet checked. A commercial TUNED needs a license review for both, and its runtime must score text without bundling either lexicon.

## Status

The derivation is done and measured, not on paper. Eight interpretable dimensions hold across a 163-piece corpus that spans conversational to academic prose; formality, concreteness, warmth, energy, and cadence are grounded in named instruments; the modes are derived by clustering rather than read off by eye (and are held open, as soft regions, pending a broader corpus). What is not built is the instrument itself: the tuning site with its basic and advanced tiers and live render, and the generation loop that turns a dial target into text that hits it, which the design flags as the central engineering risk. Those are the next work.

## Suite neighbors

- The standard and its auditor: `../missing`, `../ds4ai-check`
- The MCP server that exposes the suite as callable tools: `../ds4ai-mcp`
- The build-axis instruments: `../temper` `../grasp` `../lucid` `../grace` `../hasp` `../beacon` `../fleet`
- The app: `../polymathie`

## Design docs

Canonical in the Obsidian vault at `Durgadas2/Polymathie/`, not duplicated here:

- *TUNED - Architecture* the whole model in one place
- *TUNED - Derivation - First Pass* what the measurement actually found
- *TUNED - Copybook Format*, *TUNED - Modes*, *TUNED - Research Plan and Layer Coverage*
