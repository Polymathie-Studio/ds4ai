#!/usr/bin/env python3
"""Curate a clean technical/academic band from the mixed PDF collection.
Extracts each selected paper, strips the references apparatus and PDF noise,
truncates over-long works to an article-sized sample, and keeps only those that
land as clean article-length prose. Saves survivors to corpus/raw/sci-<slug>.txt
so the derivation picks them up, and prints an inclusion report for review.
"""
import glob, re, os, subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "corpus", "raw")
SEARCH_DIRS = [
    "/Users/Shared/MEGASYNCH/Obsidian Vault/Durgadas2/Crypto/Polymath-Wiki/raw",
    "/Users/Shared/MEGASYNCH/Obsidian Vault/Durgadas2/Proof Of Coordination/pdf",
    "/Users/Shared/MEGASYNCH/Obsidian Vault/Durgadas2/Inbox/Evolutionary Psychology- Prosocial World",
    "/Users/Shared/MEGASYNCH/Obsidian Vault/Durgadas2/Crypto/Octant/OADE-Sufficiency Research",
]
TARGETS = [
    "d._nailon_2015_epistemological_&_ontological_beliefs_for_teaching.pdf",
    "Coloniality_the_darker_side_of_Western_m.pdf",
    "18638-Article Text-43297-1-10-20120917.pdf",
    "Juarrero-Downward-Causation-Polanyi-Prigogine.pdf",
    "Wilson-et-al-2014-Prompt-Dependency-Beyond-Childhood.pdf",
    "buterin_hitzig_weyl_draft.pdf",
    "2013-05-G13-05-624-Negative_Effects_of_Extrinsic_Rewards.pdf",
    "Foundations of Cryptoeconomic Systems.pdf",
    "Open Problems In DAOs-2310.19201v2.pdf",
    "MilitaryReview_20141031_art013.pdf",
    "ergodic_theory.pdf",
    "thedeliberatelydevelopmentalorganization.pdf",
    "AStrategicOrganizationalApproachtoDevelopingLeadershipDevelopersRaveretal.2022_1.pdf",
    "Dr. Crompton Autistic peer-to-peer information transfer.pdf",
    "Darwinizing The Federalist Papers.pdf",
    "Autopoiesis_and_Cognition.pdf",
]
MINW, MAXW = 1200, 5000

def find(name):
    for d in SEARCH_DIRS:
        p = os.path.join(d, name)
        if os.path.exists(p): return p
    hits = []
    for d in SEARCH_DIRS:
        hits += glob.glob(os.path.join(d, "**", name), recursive=True)
    return hits[0] if hits else None

def extract(path):
    try:
        r = subprocess.run(["pdftotext", "-enc", "UTF-8", path, "-"],
                           capture_output=True, text=True, timeout=90)
        return r.stdout
    except Exception:
        return ""

def clean(text):
    lines = text.split("\n")
    cut = len(lines)
    for i in range(len(lines) - 1, len(lines) // 2, -1):
        if re.match(r"^\s*(references|bibliography|works cited|acknowledg)", lines[i], re.I):
            cut = i; break
    kept = []
    for ln in lines[:cut]:
        s = ln.strip()
        if len(s) < 15: continue
        alpha = sum(c.isalpha() or c.isspace() for c in s)
        if alpha / max(1, len(s)) < 0.70: continue
        kept.append(s)
    return " ".join(kept)

def slug(name):
    s = re.sub(r"\.pdf$", "", name, flags=re.I)
    s = re.sub(r"[^A-Za-z0-9]+", "-", s).strip("-").lower()
    return s[:40]

print(f"{'status':9}{'words':>7}  file")
kept = 0
for name in TARGETS:
    p = find(name)
    if not p:
        print(f"{'MISSING':9}{'-':>7}  {name}"); continue
    words = clean(extract(p)).split()
    n = len(words)
    if n < MINW:
        print(f"{'SKIP-short':9}{n:>7}  {name}"); continue
    body = " ".join(words[:MAXW])
    fn = os.path.join(OUT, f"sci-{slug(name)}.txt")
    open(fn, "w", encoding="utf-8").write(body)
    kept += 1
    tag = "TRUNC" if n > MAXW else "OK"
    print(f"{tag:9}{min(n,MAXW):>7}  {name}")
print(f"\nincluded {kept} technical pieces into corpus/raw/ (sci-*)")
