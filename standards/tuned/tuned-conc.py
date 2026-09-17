#!/usr/bin/env python3
"""Diagnose why concreteness does not cohere: is the corpus flat, or is the
mean-over-all-tokens measure washed out by function words? Tests several
concreteness statistics and their spread and correlations.
"""
import glob, re, os, json
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
CORPUS = os.path.join(HERE, "corpus", "raw")
LEX = os.path.join(HERE, "corpus", "lexicons")

CONC = {}
with open(os.path.join(LEX, "concreteness.txt"), encoding='utf-8') as fh:
    next(fh)
    for line in fh:
        p = line.rstrip("\n").split("\t")
        if len(p) >= 3 and p[1] == '0':
            try: CONC[p[0].lower()] = float(p[2])
            except ValueError: pass

STOP = set("the a an of to in and or but for with on at by from as is are was were be been being this that these those it its i we you he she they me us him her them my our your their his who which what when where how not no so if then than there here have has had do does did will would can could should may might must have very just more most some any all each".split())

POSF = json.load(open(os.path.join(HERE, "corpus", "pos-features.json")))
WORD = re.compile(r"[A-Za-z']+")

def author_of(fn):
    s = re.sub(r'^(batch|baseline)-', '', fn); s = re.sub(r'-\d+\.txt$', '', s); return re.sub(r'\.txt$', '', s)

rows = []
for f in sorted(glob.glob(os.path.join(CORPUS, "*.txt"))):
    lw = [w.lower() for w in WORD.findall(open(f, errors='ignore').read())]
    all_c = [CONC[w] for w in lw if w in CONC]
    content_c = [CONC[w] for w in lw if w in CONC and w not in STOP]
    if not content_c: continue
    n = len(lw)
    r = {
        'conc_all_mean': float(np.mean(all_c)),
        'conc_content_mean': float(np.mean(content_c)),
        'conc_hi_share': 100.0 * sum(1 for c in content_c if c >= 4.0) / n,
        'conc_lo_share': 100.0 * sum(1 for c in content_c if c <= 2.0) / n,
        'conc_sd': float(np.std(content_c)),
        'coverage': 100.0 * len(all_c) / n,
        'F': POSF[os.path.basename(f)]['F'],
    }
    rows.append(r)

keys = ['conc_all_mean', 'conc_content_mean', 'conc_hi_share', 'conc_lo_share', 'conc_sd', 'coverage']
print(f"{len(rows)} pieces\n")
print(f"{'measure':18}{'min':>8}{'max':>8}{'mean':>8}{'sd':>8}{'CV%':>8}{'corr(F)':>9}")
Fvals = np.array([r['F'] for r in rows])
for k in keys:
    v = np.array([r[k] for r in rows])
    cv = 100 * v.std() / abs(v.mean()) if v.mean() else 0
    corr = np.corrcoef(v, Fvals)[0, 1]
    print(f"{k:18}{v.min():8.2f}{v.max():8.2f}{v.mean():8.2f}{v.std():8.2f}{cv:8.1f}{corr:9.2f}")
