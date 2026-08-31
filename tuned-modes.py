#!/usr/bin/env python3
"""Derive the modes empirically: cluster the corpus pieces in the reduced
dimension space and read each cluster's dial profile, replacing the hand-read
five modes with data-derived regions. K-means and silhouette in numpy (no sklearn).
"""
import os
from collections import defaultdict
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
d = np.load(os.path.join(HERE, "corpus", "features.npz"), allow_pickle=True)
X = d["X"].astype(float); feats = list(d["feats"]); labels = list(d["labels"])
n, p = X.shape

mu, sd = X.mean(0), X.std(0); sd[sd == 0] = 1
Z = (X - mu) / sd
C = np.corrcoef(Z, rowvar=False)
val, vec = np.linalg.eigh(C); order = np.argsort(val)[::-1]
S = Z @ vec[:, order[:8]]   # top-8 PC scores

def kmeans(Xk, k, restarts=10, iters=100, seed=0):
    rng = np.random.default_rng(seed)
    best = None
    for _ in range(restarts):
        idx = [int(rng.integers(len(Xk)))]
        for _ in range(k - 1):
            dmin = np.min([np.sum((Xk - Xk[c]) ** 2, 1) for c in idx], 0)
            idx.append(int(rng.choice(len(Xk), p=dmin / dmin.sum())))
        cent = Xk[idx].copy()
        lab = np.zeros(len(Xk), int)
        for _ in range(iters):
            dist = np.array([np.sum((Xk - cent[j]) ** 2, 1) for j in range(k)]).T
            lab = dist.argmin(1)
            newc = np.array([Xk[lab == j].mean(0) if np.any(lab == j) else cent[j] for j in range(k)])
            if np.allclose(newc, cent): break
            cent = newc
        inertia = float(np.sum((Xk - cent[lab]) ** 2))
        if best is None or inertia < best[0]: best = (inertia, lab, cent)
    return best[1]

def silhouette(Xk, lab):
    D = np.sqrt(((Xk[:, None, :] - Xk[None, :, :]) ** 2).sum(2))
    ks = np.unique(lab); s = np.zeros(len(Xk))
    for i in range(len(Xk)):
        same = lab == lab[i]; same[i] = False
        a = D[i, same].mean() if same.any() else 0.0
        b = min(D[i, lab == j].mean() for j in ks if j != lab[i])
        s[i] = (b - a) / max(a, b) if max(a, b) > 0 else 0.0
    return s.mean()

print("K   silhouette")
for k in range(2, 9):
    print(f"{k}   {silhouette(S, kmeans(S, k)):.3f}")

SHOW = ['formality_F', 'mean_sent_len', 'short_sent_share', 'concrete_anchor', 'warmth',
        'energy', 'hedge', 'booster', 'first_person', 'second_person', 'exclaim',
        'opener_uniformity', 'concreteness_swing', 'mattr']

def characterize(k):
    lab = kmeans(S, k)
    print(f"\n=== K={k} clusters ===")
    for j in range(k):
        mask = lab == j
        auth = [labels[i] for i in range(n) if mask[i]]
        nsci = sum(1 for a in auth if a.startswith('sci-'))
        zc = Z[mask].mean(0)
        prof = sorted(((f, zc[feats.index(f)]) for f in SHOW if f in feats), key=lambda t: -abs(t[1]))
        hi = ", ".join(f"{f}{v:+.1f}" for f, v in prof[:6])
        print(f" c{j}: {int(mask.sum()):3d} pieces ({len(set(auth))} authors, {nsci} technical)")
        print(f"      {hi}")
    a2c = defaultdict(set); a2n = defaultdict(int)
    for i in range(n):
        a2c[labels[i]].add(int(lab[i])); a2n[labels[i]] += 1
    multi = [len(a2c[a]) for a in a2c if a2n[a] >= 2]
    print(f" author spread (authors with >=2 pieces): {np.mean(multi):.1f} clusters each on average")

characterize(5)
characterize(6)
