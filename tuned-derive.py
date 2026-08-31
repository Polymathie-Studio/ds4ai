#!/usr/bin/env python3
"""TUNED derivation, first empirical pass.

Measures the mechanical (no-external-lexicon) primitives across the corpus and
runs a principal-components pass to see what latent dimensions actually emerge,
against the derived-on-paper dial set (tone, pace, length, ease, vividness).

Honest scope: this is the mechanical subset. The lexical-affect primitives
(NRC-VAD valence/arousal, Brysbaert concreteness) are NOT here yet; they wait
until those lexicons are loaded. So the dimensions below are a partial view.
"""
import glob, re, os, math, json
import numpy as np

CORPUS = os.path.join(os.path.dirname(os.path.abspath(__file__)), "corpus", "raw")

# --- closed-class and small stance lists (no external files needed) ---
PRONOUNS = set("i we you he she it they me us him her them my our your his its their mine ours yours theirs myself ourselves yourself himself herself itself themselves".split())
FIRST = set("i we me us my our mine ours myself ourselves".split())
SECOND = set("you your yours yourself yourselves".split())
ARTICLES = set("a an the".split())
PREPS = set("of in to for with on at by from as into about over after under between through during without within against among across before behind below beside".split())
HEDGES = set("may might perhaps possibly seems seem appears appear likely could would generally relatively somewhat about probably arguably suggests roughly often sometimes".split())
BOOSTERS = set("clearly obviously definitely certainly indeed undoubtedly always never must prove proves demonstrate demonstrates shows clear evident surely truly essentially fundamentally".split())
NOMINAL = re.compile(r'^[a-z]{3,}(tions?|ities|ity|isms?|ments?|ance|ence|ivity)$', re.I)

# --- external lexicons (loaded once; research-use, not redistributed) ---
LEX = os.path.join(os.path.dirname(os.path.abspath(__file__)), "corpus", "lexicons")
VAD = {}
with open(os.path.join(LEX, "NRC-VAD-Lexicon", "NRC-VAD-Lexicon.txt"), encoding='utf-8') as fh:
    for line in fh:
        p = line.rstrip("\n").split("\t")
        if len(p) == 4:
            try: VAD[p[0]] = (float(p[1]), float(p[2]), float(p[3]))
            except ValueError: pass
CONC = {}
with open(os.path.join(LEX, "concreteness.txt"), encoding='utf-8') as fh:
    next(fh)
    for line in fh:
        p = line.rstrip("\n").split("\t")
        if len(p) >= 3 and p[1] == '0':
            try: CONC[p[0].lower()] = float(p[2])
            except ValueError: pass
print(f"lexicons: NRC-VAD {len(VAD)} words, Brysbaert concreteness {len(CONC)} words\n")

# real part-of-speech F-score + open-class densities, precomputed by tuned-pos.py
POSF = {}
_posfile = os.path.join(LEX, "..", "pos-features.json")
if os.path.exists(_posfile):
    POSF = json.load(open(_posfile))
    print(f"pos-features: {len(POSF)} files (real F-score, open-class densities)\n")

WORD = re.compile(r"[A-Za-z']+")
SENT = re.compile(r'(?<=[.!?])\s+')

def syllables(w):
    w = w.lower().strip("'")
    if not w: return 1
    groups = re.findall(r'[aeiouy]+', w)
    n = len(groups)
    if w.endswith('e') and n > 1: n -= 1
    return max(1, n)

def mattr(tokens, window=100):
    if len(tokens) < window:
        return len(set(tokens)) / len(tokens) if tokens else 0.0
    ratios = []
    for i in range(len(tokens) - window + 1):
        w = tokens[i:i+window]
        ratios.append(len(set(w)) / window)
    return float(np.mean(ratios))

def measure(text):
    sents = [s for s in SENT.split(text.strip()) if s.strip()]
    words = WORD.findall(text)
    lw = [w.lower() for w in words]
    n = len(words); ns = max(1, len(sents))
    if n == 0: return None
    per1k = lambda c: 1000.0 * c / n
    slens = [len(WORD.findall(s)) for s in sents]
    slens = [x for x in slens if x > 0] or [n]
    syl = sum(syllables(w) for w in words)
    caps = sum(1 for w in words if len(w) >= 2 and w.isupper())
    d = {}
    d['mean_sent_len'] = float(np.mean(slens))
    d['sd_sent_len'] = float(np.std(slens))
    d['short_sent_share'] = 100.0 * sum(1 for x in slens if x < 8) / len(slens)
    d['long_sent_share'] = 100.0 * sum(1 for x in slens if x > 30) / len(slens)
    d['mean_word_len'] = float(np.mean([len(w) for w in words]))
    d['flesch'] = 206.835 - 1.015*(n/ns) - 84.6*(syl/n)
    d['pronoun'] = per1k(sum(1 for w in lw if w in PRONOUNS))
    d['first_person'] = per1k(sum(1 for w in lw if w in FIRST))
    d['second_person'] = per1k(sum(1 for w in lw if w in SECOND))
    d['article'] = per1k(sum(1 for w in lw if w in ARTICLES))
    d['prep'] = per1k(sum(1 for w in lw if w in PREPS))
    d['hedge'] = per1k(sum(1 for w in lw if w in HEDGES))
    d['booster'] = per1k(sum(1 for w in lw if w in BOOSTERS))
    d['nominal'] = per1k(sum(1 for w in lw if NOMINAL.match(w)))
    vv = [VAD[w] for w in lw if w in VAD]
    # NRC-VAD valence/arousal/dominance, surfaced as plain words: warmth/energy/authority
    d['warmth'] = float(np.mean([x[0] for x in vv])) if vv else 0.5
    d['energy'] = float(np.mean([x[1] for x in vv])) if vv else 0.5
    d['authority'] = float(np.mean([x[2] for x in vv])) if vv else 0.5
    cc = [CONC[w] for w in lw if w in CONC]
    # concreteness as anchor density, not a mean: the mean is flat (CV ~4%),
    # the share of highly-concrete words varies sevenfold (see tuned-conc.py)
    d['concrete_anchor'] = per1k(sum(1 for c in cc if c >= 4.0))
    d['abstract_share'] = per1k(sum(1 for c in cc if c <= 2.0))
    d['exclaim'] = per1k(text.count('!'))
    d['question'] = per1k(text.count('?'))
    d['comma'] = per1k(text.count(','))
    d['dash'] = per1k(len(re.findall('[\u2014\u2013]|(?<=\\s)-(?=\\s)', text)))
    d['caps_run'] = per1k(caps)
    d['mattr'] = mattr(lw)
    # --- higher-order primitives: within-piece dynamics (variance across the piece) ---
    def window_sd(valfn, win=60):
        vals = []
        for i in range(0, len(lw), win):
            ch = [v for v in (valfn(w) for w in lw[i:i+win]) if v is not None]
            if ch: vals.append(sum(ch) / len(ch))
        return float(np.std(vals)) if len(vals) >= 2 else 0.0
    d['concreteness_swing'] = window_sd(lambda w: CONC.get(w))       # abstract-to-concrete ladder
    d['warmth_swing'] = window_sd(lambda w: VAD[w][0] if w in VAD else None)
    d['energy_swing'] = window_sd(lambda w: VAD[w][1] if w in VAD else None)
    ops = [ws[0].lower() for ws in (WORD.findall(s) for s in sents) if ws]
    d['opener_uniformity'] = 100.0 * max((ops.count(o) for o in set(ops)), default=0) / len(ops) if ops else 0.0
    return d

def author_of(fn):
    s = re.sub(r'^(batch|baseline)-', '', fn); s = re.sub(r'-\d+\.txt$', '', s); return re.sub(r'\.txt$', '', s)

rows = []; labels = []
for f in sorted(glob.glob(os.path.join(CORPUS, "*.txt"))):
    t = open(f, errors='ignore').read()
    m = measure(t)
    if not m: continue
    bn = os.path.basename(f)
    if POSF and bn in POSF:
        p = POSF[bn]
        m['formality_F'] = p['F']; m['noun'] = p['noun']; m['verb'] = p['verb']
        m['adj'] = p['adj']; m['adverb'] = p['adverb']
    rows.append(m); labels.append(author_of(bn))

feats = list(rows[0].keys())
X = np.array([[r[k] for k in feats] for r in rows], float)
np.savez(os.path.join(os.path.dirname(os.path.abspath(__file__)), "corpus", "features.npz"),
         X=X, feats=np.array(feats, dtype=object), labels=np.array(labels, dtype=object))
print(f"corpus: {X.shape[0]} pieces, {X.shape[1]} mechanical primitives\n")

# standardize
mu = X.mean(0); sd = X.std(0); sd[sd == 0] = 1
Z = (X - mu) / sd

# PCA via eigdecomposition of the correlation matrix
C = np.corrcoef(Z, rowvar=False)
vals, vecs = np.linalg.eigh(C)
order = np.argsort(vals)[::-1]
vals = vals[order]; vecs = vecs[:, order]
var = vals / vals.sum()

print("=== variance explained (first 8 components) ===")
cum = 0
for i in range(min(8, len(vals))):
    cum += var[i]
    print(f"PC{i+1}: {100*var[i]:5.1f}%  (cumulative {100*cum:5.1f}%)  eigenvalue {vals[i]:.2f}")

nkeep = int(np.sum(vals >= 1.0))
print(f"\n=== top loadings per component (|loading| >= 0.30), {nkeep} components with eigenvalue >= 1 ===")
for i in range(min(nkeep, len(vals))):
    load = [(feats[j], vecs[j, i]) for j in range(len(feats))]
    load.sort(key=lambda t: -abs(t[1]))
    strong = [(f, round(w, 2)) for f, w in load if abs(w) >= 0.30]
    print(f"\nPC{i+1} ({100*var[i]:.1f}%):")
    for f, w in strong:
        print(f"   {'+' if w > 0 else '-'} {f:16} {w:+.2f}")

print("\n=== where each lexical/affect primitive lives (its strongest component) ===")
for name in ['concreteness_swing', 'warmth_swing', 'energy_swing', 'opener_uniformity', 'formality_F', 'concrete_anchor']:
    j = feats.index(name)
    comp = [(i, vecs[j, i]) for i in range(min(nkeep, len(vals)))]
    comp.sort(key=lambda t: -abs(t[1]))
    top = ", ".join(f"PC{i+1}:{w:+.2f}" for i, w in comp[:3])
    print(f"   {name:14} {top}")
