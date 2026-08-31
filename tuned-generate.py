#!/usr/bin/env python3
"""TUNED generator: the engine's write step.

Assembles the request that produces tuned writing, in two parts: a compensation
preamble that pre-loads the opposite of the model's measured pulls (the "zero
the instrument" step), and copybook guidance that aims the dials at the target.
The model call is key-private (HASP): it reads the user's own key from the
environment at call time and never prints, logs, or stores it. Whoever runs the
live call is the key-holder; locally that is you, in your own terminal.

  # dry run: print the request, no key, no call, no cost
  python tuned-generate.py copybooks/expository.json "brief..." --dry-run

  # live run (you, in your terminal where ANTHROPIC_API_KEY lives)
  python tuned-generate.py copybooks/expository.json "brief..."
"""
import os, sys, json, argparse

HERE = os.path.dirname(os.path.abspath(__file__))

def _load_env_file():
    """Load KEY=VALUE lines from a local .env.local or .env into the environment,
    without overriding anything already set. Values are read, never printed."""
    for fn in (".env.local", ".env"):
        p = os.path.join(HERE, fn)
        if not os.path.exists(p):
            continue
        for line in open(p):
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))

# Pre-load the opposite of the model's measured pulls (see the pull-profile /
# drift signatures). This is the compensation step expressed as instruction.
COMPENSATION = (
    "Before anything else, correct for your own known drifts as a writer.\n"
    "- Vary how sentences open. Do not begin a run of sentences the same way, and do not lean on 'the' as a default opener.\n"
    "- Do not settle into a repeated phrasing or a signature construction; avoid locking onto 'is exactly', 'not just X but Y', and similar templates.\n"
    "- Do not use the filler words genuinely, honestly, straightforward, importantly, certainly, absolutely, fascinating.\n"
    "- Use antithesis (rather than, not X but Y) sparingly, as a marked effect, never as a default rhythm.\n"
    "- Do not open with a bold claim and a soft tail, and do not end on an aphoristic kicker.\n"
    "- Write as a person addressing a reader, not as a summary of a topic."
)


def copybook_guidance(cb):
    """Translate a copybook's targets and rules into plain generation guidance."""
    g = [f"Write in the target voice named '{cb.get('name', 'this copybook')}'."]
    t = cb.get("targets", {})

    def band(name, lo, hi, low_txt, mid_txt, hi_txt):
        spec = t.get(name)
        if not spec: return None
        v = spec["target"]
        return low_txt if v <= lo else (hi_txt if v >= hi else mid_txt)

    for line in [
        band("formality_F", 55, 68,
             "Keep it involved and plain: pronouns, contractions, direct address.",
             "Hold a middle register, neither stiff nor chatty.",
             "Keep it formal and explicit: prefer nouns and prepositions and full forms over pronouns and contractions."),
        band("concreteness_anchor", 30, 60,
             "Stay conceptual; few concrete specifics.",
             "Ground the abstract in a real specific where it helps.",
             "Anchor in concrete specifics and named examples; descend the ladder from any abstraction."),
        band("mean_sentence_len", 14, 24,
             "Keep sentences short and punchy.",
             "Vary sentence length; mostly mid-length.",
             "Allow long, subordinated sentences, rested by shorter ones."),
        band("certainty_net", -6, 6,
             "Hedge; state positions tentatively.",
             "State positions plainly, hedging only where warranted.",
             "State positions with conviction; few hedges."),
    ]:
        if line: g.append("- " + line)

    for name, spec in cb.get("preferences", {}).items():
        if name == "em_dash_count" and spec.get("max") == 0:
            g.append("- Do not use em dashes at all. Use commas, colons, semicolons, or separate sentences.")
    return "\n".join(g)


def build_request(cb, task):
    system = COMPENSATION + "\n\n" + copybook_guidance(cb)
    return system, task


def call_model(system, user, model, max_tokens):
    import urllib.request
    _load_env_file()
    key = os.environ.get("ANTHROPIC_API_KEY")
    if not key:
        sys.exit("ANTHROPIC_API_KEY is not set in this environment.\n"
                 "Run the live call in your own terminal where your key lives. "
                 "Nothing here reads or prints the key.")
    body = json.dumps({"model": model, "max_tokens": max_tokens, "system": system,
                       "messages": [{"role": "user", "content": user}]}).encode()
    req = urllib.request.Request("https://api.anthropic.com/v1/messages", data=body,
                                 headers={"x-api-key": key, "anthropic-version": "2023-06-01",
                                          "content-type": "application/json"})
    try:
        with urllib.request.urlopen(req) as r:
            resp = json.load(r)
    except urllib.error.HTTPError as e:
        detail = e.read().decode(errors="ignore")
        sys.exit(f"API error {e.code}: {detail}")
    return "".join(b.get("text", "") for b in resp.get("content", []))


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("copybook")
    ap.add_argument("task", help="the writing brief, or a path to a file containing it")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--model", default="claude-sonnet-5")
    ap.add_argument("--max-tokens", type=int, default=1500)
    a = ap.parse_args()

    cb = json.load(open(a.copybook))
    task = open(a.task).read() if os.path.exists(a.task) else a.task
    system, user = build_request(cb, task)

    if a.dry_run:
        print("=== SYSTEM (compensation + copybook guidance) ===\n")
        print(system)
        print("\n=== USER (the task) ===\n")
        print(user)
        print("\n=== (dry run: no key read, no model called) ===")
    else:
        print(call_model(system, user, a.model, a.max_tokens))
