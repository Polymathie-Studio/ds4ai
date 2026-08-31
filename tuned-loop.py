#!/usr/bin/env python3
"""TUNED loop: the engine's feedback closing the chain (CRAFT Condition 6).

Generate, verify against the copybook, and if the draft is rejected, feed the
specific misses back as a revision instruction and regenerate, up to a cap.
Success is an accepted verdict (all dials landed) or, for short copy where the
statistical dials cannot resolve, an indeterminate verdict with no determinate
violation (no failed preference and no exceeded pull bound). Each iteration is a
live model call, so the cap bounds cost. Key-private via the generator.

  python tuned-loop.py copybooks/expository.json "brief..." [--max-iters 3]
"""
import os, sys, json, argparse
from importlib import import_module

gen = import_module("tuned-generate")
verify = import_module("tuned-verify").verify


def corrective(v):
    notes = []
    for d in v["misses"].get("drift_exceeded", []):
        if "opener" in d:
            notes.append("Vary how sentences begin; do not repeat the same opening word, especially 'The'.")
        elif "is_exactly" in d or "not_just" in d:
            notes.append("Drop the repeated construction; do not lock onto 'is exactly' or 'not just X but Y'.")
        elif "rather_than" in d:
            notes.append("Use 'rather than' and antithesis less; recast some as plain statements.")
        elif "filler" in d:
            notes.append("Remove filler words such as genuinely, honestly, importantly.")
    for p in v["misses"].get("preference_fail", []):
        if p == "em_dash_count":
            notes.append("Remove every em dash; use commas, colons, or separate sentences.")
    for t in v["misses"].get("drifted", []):
        notes.append(f"Move {t} toward the copybook target.")
    return " ".join(notes) or "Tighten the writing toward the copybook targets."


def succeeded(v):
    if v["verdict"] == "accepted":
        return True
    m = v.get("misses", {})
    return v["verdict"] == "indeterminate" and not m.get("drift_exceeded") and not m.get("preference_fail") and not m.get("drifted")


def run(cb, task, model, max_tokens, max_iters):
    system, user = gen.build_request(cb, task)
    draft, v = None, None
    for i in range(1, max_iters + 1):
        draft = gen.call_model(system, user, model, max_tokens)
        v = verify(draft, cb)
        yield i, draft, v
        if succeeded(v):
            return
        fix = corrective(v)
        user = (f"{task}\n\nHere is a draft:\n\n{draft}\n\n"
                f"Revise it to fix these specific problems, keeping everything else: {fix}")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("copybook")
    ap.add_argument("task")
    ap.add_argument("--model", default="claude-sonnet-5")
    ap.add_argument("--max-tokens", type=int, default=1500)
    ap.add_argument("--max-iters", type=int, default=3)
    a = ap.parse_args()
    cb = json.load(open(a.copybook))
    task = open(a.task).read() if os.path.exists(a.task) else a.task
    final = None
    for i, draft, v in run(cb, task, a.model, a.max_tokens, a.max_iters):
        print(f"--- iteration {i}: verdict {v['verdict']}, response {v.get('response')}, "
              f"misses {[k for k,val in v['misses'].items() if val]} ---")
        final = (draft, v)
    print("\n=== FINAL ===")
    print(final[0])
    print(f"\n[{'converged' if succeeded(final[1]) else 'hit iteration cap'} in the loop]")
