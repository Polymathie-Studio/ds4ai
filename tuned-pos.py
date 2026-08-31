#!/usr/bin/env python3
"""Compute the real Heylighen-Dewaele F-score per corpus file using an actual
part-of-speech tagger (NLTK averaged perceptron), and the open-class densities
the closed-class proxy could not see. Writes corpus/pos-features.json so the
main derivation script stays dependency-light (system python + numpy).

Run with the scratchpad venv that has nltk, e.g.:
  NLTK_DATA=<scratch>/nltk_data <scratch>/.venv/bin/python tuned-pos.py
"""
import glob, re, os, json
import nltk

HERE = os.path.dirname(os.path.abspath(__file__))
CORPUS = os.path.join(HERE, "corpus", "raw")
OUT = os.path.join(HERE, "corpus", "pos-features.json")
nd = os.environ.get("NLTK_DATA")
if nd: nltk.data.path.insert(0, nd)

WORD = re.compile(r"[A-Za-z']+")
ARTICLES = {"a", "an", "the"}

def fscore_features(text):
    toks = WORD.findall(text)
    if not toks: return None
    tags = nltk.pos_tag(toks)
    n = len(toks)
    noun = adj = prep = art = pron = verb = adv = interj = 0
    for w, t in tags:
        wl = w.lower()
        if wl in ARTICLES: art += 1
        elif t.startswith('NN'): noun += 1
        elif t.startswith('JJ'): adj += 1
        elif t == 'IN': prep += 1
        elif t in ('PRP', 'PRP$', 'WP', 'WP$'): pron += 1
        elif t.startswith('VB') or t == 'MD': verb += 1
        elif t.startswith('RB') or t == 'WRB': adv += 1
        elif t == 'UH': interj += 1
    formal = noun + adj + prep + art
    deictic = pron + verb + adv + interj
    F = 50.0 * ((formal - deictic) / n + 1.0)
    per1k = lambda c: 1000.0 * c / n
    return {"F": F, "noun": per1k(noun), "verb": per1k(verb),
            "adj": per1k(adj), "adverb": per1k(adv)}

def author_of(fn):
    s = re.sub(r'^(batch|baseline)-', '', fn); s = re.sub(r'-\d+\.txt$', '', s); return re.sub(r'\.txt$', '', s)

out = {}
files = sorted(glob.glob(os.path.join(CORPUS, "*.txt")))
for i, f in enumerate(files):
    t = open(f, errors='ignore').read()
    feat = fscore_features(t)
    if feat: out[os.path.basename(f)] = feat

json.dump(out, open(OUT, 'w'), indent=0)
Fs = [v["F"] for v in out.values()]
print(f"tagged {len(out)} files -> {OUT}")
print(f"F-score range: {min(Fs):.1f} to {max(Fs):.1f}, mean {sum(Fs)/len(Fs):.1f}")
