#!/usr/bin/env python3
"""TUNED runtime scorer: the engine's instrument (CRAFT Condition 3).

Scores one piece of text on demand and returns its dial profile, its drift
signatures (the model's measured pull-profile, the thing the engine binds), and
the instrument's own uncertainty. This is the sensor every other engine stage
calls: compensation-confirmation, verification, and the control loop.

The formality F-score uses an NLTK part-of-speech tagger when available; without
it, formality is reported as unavailable rather than proxied, so a reading is
never dressed as more certain than it is.

  from importlib import import_module
  score = import_module('tuned-score').score
  profile = score(text)
"""
import os, re, json, math

HERE = os.path.dirname(os.path.abspath(__file__))
LEX = os.path.join(HERE, "corpus", "lexicons")
NOISE_FLOOR = 400  # words; below this the readings are indeterminate

WORD = re.compile(r"[A-Za-z']+")
SENT = re.compile(r'(?<=[.!?])\s+')
ARTICLES = {"a", "an", "the"}
FIRST = set("i we me us my our mine ours myself ourselves".split())
SECOND = set("you your yours yourself yourselves".split())
HEDGES = set("may might perhaps possibly seems seem appears appear likely could would generally relatively somewhat about probably arguably suggests roughly often sometimes".split())
BOOSTERS = set("clearly obviously definitely certainly indeed undoubtedly always never must prove proves demonstrate demonstrates shows clear evident surely truly essentially fundamentally".split())
FILLER = set("genuinely honestly straightforward importantly needless certainly absolutely fascinating".split())  # the banned-filler set
NOMINAL = re.compile(r'^[a-z]{3,}(tions?|ities|ity|isms?|ments?|ance|ence|ivity)$', re.I)

def _load_vad():
    d = {}
    p = os.path.join(LEX, "NRC-VAD-Lexicon", "NRC-VAD-Lexicon.txt")
    if os.path.exists(p):
        for line in open(p, encoding='utf-8'):
            f = line.rstrip("\n").split("\t")
            if len(f) == 4:
                try: d[f[0]] = (float(f[1]), float(f[2]))
                except ValueError: pass
    return d

def _load_conc():
    d = {}
    p = os.path.join(LEX, "concreteness.txt")
    if os.path.exists(p):
        fh = open(p, encoding='utf-8'); next(fh)
        for line in fh:
            f = line.rstrip("\n").split("\t")
            if len(f) >= 3 and f[1] == '0':
                try: d[f[0].lower()] = float(f[2])
                except ValueError: pass
    return d

VAD, CONC = _load_vad(), _load_conc()

try:
    import nltk
    nd = os.environ.get("NLTK_DATA")
    if nd: nltk.data.path.insert(0, nd)
    nltk.pos_tag(["test"])
    _HAS_POS = True
except Exception:
    _HAS_POS = False

def _syllables(w):
    w = w.lower().strip("'")
    g = re.findall(r'[aeiouy]+', w)
    n = len(g) - (1 if w.endswith('e') and len(g) > 1 else 0)
    return max(1, n)

def _fscore(tokens):
    if not _HAS_POS: return None
    tags = nltk.pos_tag(tokens); n = len(tokens)
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
    return 50.0 * ((noun + adj + prep + art - pron - verb - adv - interj) / n + 1.0)

def score(text):
    """Return the runtime profile of one text: dials, drift signatures, uncertainty."""
    words = WORD.findall(text)
    lw = [w.lower() for w in words]
    n = len(words)
    if n == 0:
        return {"words": 0, "reliable": False, "note": "empty"}
    sents = [s for s in SENT.split(text.strip()) if s.strip()]
    slens = [len(WORD.findall(s)) for s in sents] or [n]
    per1k = lambda c: round(1000.0 * c / n, 2)
    low = text.lower()

    vv = [VAD[w] for w in lw if w in VAD]
    cc = [CONC[w] for w in lw if w in CONC]
    openers = [WORD.findall(s)[0].lower() for s in sents if WORD.findall(s)]
    top_opener = max((openers.count(o) for o in set(openers)), default=0)
    F = _fscore(words)

    dials = {
        "formality_F": round(F, 1) if F is not None else None,
        "warmth": round(sum(x[0] for x in vv) / len(vv), 3) if vv else None,
        "energy": round(sum(x[1] for x in vv) / len(vv), 3) if vv else None,
        "certainty_net": per1k(sum(1 for w in lw if w in BOOSTERS) - sum(1 for w in lw if w in HEDGES)),
        "engagement": per1k(sum(1 for w in lw if w in SECOND) + low.count('?')),
        "concreteness_anchor": per1k(sum(1 for c in cc if c >= 4.0)),
        "mean_sentence_len": round(sum(slens) / len(slens), 1),
        "sentence_len_sd": round((sum((x - sum(slens)/len(slens))**2 for x in slens) / len(slens))**0.5, 1),
        "short_sentence_share_pct": round(100.0 * sum(1 for x in slens if x < 8) / len(slens), 1),
        "flesch": round(206.835 - 1.015*(n/max(1,len(sents))) - 84.6*(sum(_syllables(w) for w in words)/n), 1),
    }
    drift = {  # the model's measured pull-profile: what the engine binds
        "opener_top_share_pct": round(100.0 * top_opener / len(openers), 1) if openers else 0.0,
        "the_opener_pct": round(100.0 * sum(1 for o in openers if o == 'the') / len(openers), 1) if openers else 0.0,
        "is_exactly_per1k": per1k(len(re.findall(r'\bis exactly\b', low))),
        "not_just_per1k": per1k(len(re.findall(r'\bnot just\b', low))),
        "rather_than_per1k": per1k(len(re.findall(r'\brather than\b', low))),
        "filler_per1k": per1k(sum(1 for w in lw if w in FILLER)),
        "em_dash_count": text.count(chr(0x2014)),
        "nominalization_per1k": per1k(sum(1 for w in lw if NOMINAL.match(w))),
    }
    return {
        "words": n,
        "reliable": n >= NOISE_FLOOR,
        "note": None if n >= NOISE_FLOOR else f"below the {NOISE_FLOOR}-word noise floor: readings are indeterminate",
        "formality_available": F is not None,
        "dials": dials,
        "drift_signatures": drift,
    }

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("usage: tuned-score.py <file.txt>"); sys.exit(1)
    txt = open(sys.argv[1], errors='ignore').read()
    print(json.dumps(score(txt), indent=2))
