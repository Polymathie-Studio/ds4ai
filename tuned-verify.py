#!/usr/bin/env python3
"""TUNED verifier: the engine's decision logic (CRAFT Condition 5).

Takes a text and a copybook and returns the three-valued per-dial verdict
(landed, drifted, or indeterminate), the hard-preference pass/fail, and the
drift-bound check that confirms the model's pulls stayed compensated. The
verdict is the accepted / rejected / indeterminate outcome CRAFT Section 12.2
specifies, with the reading carried against its target so an indeterminate
outcome is traceable to the noise floor that produced it.

  python tuned-verify.py copybooks/expository.json some_text.txt
"""
import os, sys, json
from importlib import import_module

score = import_module("tuned-score").score


def _check_target(value, spec, reliable):
    if value is None:
        return "indeterminate", "reading unavailable"
    if not reliable:
        return "indeterminate", "below the noise floor"
    lo, hi = spec["target"] - spec["tolerance"], spec["target"] + spec["tolerance"]
    if lo <= value <= hi:
        return "landed", f"{value} in [{lo}, {hi}]"
    return "drifted", f"{value} outside [{lo}, {hi}]"


def verify(text, copybook):
    p = score(text)
    if not p.get("dials"):
        return {"verdict": "indeterminate", "note": p.get("note", "unscorable")}
    dials, drift = p["dials"], p["drift_signatures"]
    reliable = p["reliable"]

    target_results = {}
    for name, spec in copybook.get("targets", {}).items():
        target_results[name] = _check_target(dials.get(name), spec, reliable)

    pref_results = {}
    for name, spec in copybook.get("preferences", {}).items():
        v = dials.get(name, drift.get(name))
        ok = ("max" not in spec or v <= spec["max"]) and ("min" not in spec or v >= spec["min"])
        pref_results[name] = ("pass" if ok else "fail", f"{v} vs {spec}")

    drift_results = {}
    for name, spec in copybook.get("drift_bounds", {}).items():
        v = drift.get(name)
        within = v is not None and ("max" not in spec or v <= spec["max"])
        drift_results[name] = ("within" if within else "exceeded", f"{v} vs max {spec.get('max')}")

    drifted = [n for n, (r, _) in target_results.items() if r == "drifted"]
    indet = [n for n, (r, _) in target_results.items() if r == "indeterminate"]
    pref_fail = [n for n, (r, _) in pref_results.items() if r == "fail"]
    drift_exceeded = [n for n, (r, _) in drift_results.items() if r == "exceeded"]

    # CRAFT resolution floor (Condition 3): below the noise floor the statistical
    # dials are indeterminate, but the determinate-resolution class (hard
    # preferences and the discrete drift signatures) stays valid at any length.
    if pref_fail or drift_exceeded:
        verdict = "rejected"
    elif not reliable:
        verdict = "indeterminate"
    elif drifted:
        verdict = "rejected"
    elif indet:
        verdict = "indeterminate"
    else:
        verdict = "accepted"

    # CRAFT construction grammar 9.2: distinguish accidental drift from adversarial.
    # Targets met but a pull bound exceeded is the gaming case (hitting the numbers
    # while the pulls slip), which is a stronger signal than an ordinary miss.
    response = "accept"
    if verdict == "rejected":
        response = "adversarial" if (drift_exceeded and not drifted) else "regenerate"

    return {
        "verdict": verdict,
        "response": response,
        "words": p["words"],
        "reliable": reliable,
        "targets": target_results,
        "preferences": pref_results,
        "drift_bounds": drift_results,
        "misses": {"drifted": drifted, "indeterminate": indet, "preference_fail": pref_fail, "drift_exceeded": drift_exceeded},
    }


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("usage: tuned-verify.py <copybook.json> <text.txt>"); sys.exit(1)
    cb = json.load(open(sys.argv[1]))
    txt = open(sys.argv[2], errors="ignore").read()
    print(json.dumps(verify(txt, cb), indent=2))
