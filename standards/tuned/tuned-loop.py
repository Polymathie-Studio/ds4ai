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


def miss_score(v):
    """Lower is less drifted. Hard determinate misses (a failed preference, a
    slipped pull) weigh more than a statistical dial being off."""
    m = v.get("misses", {})
    return 2 * (len(m.get("preference_fail", [])) + len(m.get("drift_exceeded", []))) + len(m.get("drifted", []))


def persistent_misses(v):
    m = v.get("misses", {})
    return {k: m[k] for k in ("preference_fail", "drift_exceeded", "drifted") if m.get(k)}


def run(cb, task, model, max_tokens, max_iters, on_iter=None):
    """Iterate generate/verify/correct. Return the BEST draft seen (convergence
    is not monotonic, so the last is not necessarily the least drifted) with a
    converged flag; on the cap the caller escalates rather than shipping drift."""
    system, user = gen.build_request(cb, task)
    best = None
    for i in range(1, max_iters + 1):
        draft = gen.call_model(system, user, model, max_tokens)
        v = verify(draft, cb)
        if on_iter:
            on_iter(i, v)
        s = miss_score(v)
        if best is None or s < best["score"]:
            best = {"score": s, "iter": i, "draft": draft, "v": v}
        if succeeded(v):
            return {"score": s, "iter": i, "draft": draft, "v": v, "converged": True}
        user = (f"{task}\n\nHere is a draft:\n\n{draft}\n\n"
                f"Revise it to fix these specific problems, keeping everything else: {corrective(v)}")
    best["converged"] = False
    return best


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
    def show(i, v):
        print(f"--- iteration {i}: verdict {v['verdict']}, response {v.get('response')}, "
              f"misses {[k for k, val in v['misses'].items() if val]} ---")

    res = run(cb, task, a.model, a.max_tokens, a.max_iters, on_iter=show)
    print("\n=== FINAL (best draft) ===")
    print(res["draft"])
    if res["converged"]:
        print(f"\n[converged at iteration {res['iter']}]")
    else:
        pm = persistent_misses(res["v"])
        print(f"\n[did not converge in {a.max_iters} passes. Best draft is from iteration "
              f"{res['iter']}. These would not zero: {pm}. That usually means the copybook "
              f"target is unreachable for this content or two targets conflict, which is a "
              f"writer's call: review the draft, or adjust the copybook. (CRAFT double-loop.)]")
