# TUNED - Structure and Copybook Plan

Version 0.1.0 working draft | 2026-08-28

Purpose: fix the structure of TUNED and say precisely what goes in each part and why each part works best. TUNED is a general writing standard, for any kind of copy and for other people to use, not only marketing and not only a standards register. Its portable unit is the copybook, not a playbook or a runbook: a thin, shareable spec for one register that a person can write, keep, refine, and send to someone else.

## The one split that makes it simple

Everything below rests on a single division. Heavy, shared, register-independent knowledge lives once in the Engine, authored by Durgadas. Light, personal, register-specific knowledge lives in a Copybook, authored by anyone. The Engine is written once and is hard to write; a Copybook is thin and easy to write, because all the craft it would otherwise have to restate already sits in the Engine. This split is what keeps a copybook to about a page, keeps the person from being overloaded, keeps the model from being overloaded, and lets copybooks travel between people. Any time a design choice is unclear, the test is: is this knowledge the same across all registers (Engine) or specific to this one (Copybook)?

## The prior art it stands on

TUNED does not invent copy craft. The concrete-to-abstract move, Claim-Frame-Prove, the ladder of abstraction, and the conversion baseline are established and are already codified twice over: in the concrete-abstract copy playbook (grounded in Hayakawa, the Heaths, and Barnard) and in Corey Haines's Marketing Skills. TUNED runs the same research independently and lands on the same baseline, which is convergent validation, not borrowing. What is uniquely ours is what neither codification contains: the instrument-model that pre-corrects an AI's own drift, the copybook mechanism that locks a register without a setup conversation, and the presence the two produce together. The field validates the baseline and is silent on the rest, and that silence is the contribution.

## Architecture: three parts

- The Engine. Shared, heavy, authored once by Durgadas. The craft, the instrument-model, the protocol, the schema, and the verifier.
- The Copybook. Thin, personal, per register, shareable. The target for one register, as a delta from the model's default.
- The Process. Onboarding, then ingestion, then interview, then copybook, then tuned output, then verify, then refine and share.

---

## The Engine

### 1. The craft baseline

What is in it: the register-independent craft. The ladder of abstraction (state the abstraction once, then descend to an inspectable concrete, avoid the vague middle). The four beats (Claim, Frame, Prove, Translate) and their tests. The register arc (name the problem once and concretely, then resolve on the gain and spend most of the copy there; the failure is the ratio and the arc, not the presence of any negative). Concreteness as granularity (a real specific, not a mentioned example). The general hygiene the playbook and Marketing Skills agree on, deduplicated (active voice, cut filler, show rather than tell, no fabrication).

Why it works best here: this knowledge is identical across every register, so it belongs in one place, not repeated in every copybook. Putting it in the Engine is the specific move that lets a copybook stay thin. It is also the rigor floor that applies to all copy equally, so nothing is loose just because it is not in a standards register.

### 2. The instrument-model

What is in it: a characterization of the model as the thing being tuned. Its over-correction drifts (sycophancy, aphoristic drift, negative-framing drift, overshoot when told to fix something, over-production). Its under-correction drifts (defaulting to the median, mirroring surface style instead of the intent under it, misjudging how deep or formal to go without held context). Its hard limits, which no copybook can change (it cannot invent a fact, hold standing context across sessions, or supply care and stake). And the real capacities to tune with (high-fidelity mirroring from examples, structural decomposition, precise execution of a stated instruction, tireless mechanical checking).

This part has two faces. The internal face is the pre-correction: the Engine loads the opposite of each known drift before writing. The user-facing face is the onboarding declaration, the first thing a person meets: how I work best, what I will do well, where I drift and how you can catch me, and what stays yours because I cannot supply it (the facts, the care, the final ownership).

Why it works best: tuning needs a model of the instrument, not only of the target, the same way a palette solver needs the display's gamut and not only the contrast goal. This is the part the whole copy field lacks, because every framework was written for a human writing to a human. It is co-produced: the model self-reports its drifts and Durgadas corrects the report, because the self-report is itself subject to the sycophancy it is trying to name.

### 3. The ingestion and interview protocol

What is in it: the procedure that turns an example plus a conversation into a copybook. Ingestion takes an example of a register the person likes, as a document, a URL, or pasted text. The interview then extracts, around that example, the intent, the point of view, the context, the deltas, and the hard rules.

It carries a branch for the person who is not a good writer in this register, which is common and must be first-class. That person cannot supply a strong example from their own work, so the protocol offers two other paths. They can point at someone else's work they admire, and TUNED tunes to the admired target, not to their own weaker writing. Or, given only a light statement of intent and point of view, TUNED drafts two or three candidate register samples and the person reacts, picking and correcting. Either path ends with usable exemplars.

Why it works best: it splits the labor along the line people can actually hold. The person supplies recognition, which almost everyone has, the ability to tell good writing in a register from bad. The model supplies production, mirroring to whatever target the recognition points at. A person who cannot write a register can still recognize it, so TUNED works for them by asking only for the half they have. This is also why the example is the core input and the interview only surrounds it: the model mirrors a register from real samples far better than from adjectives.

### 4. The copybook schema

What is in it: the machine-readable and human-readable definition of a copybook's fields, so copybooks validate, travel, and interoperate. A JSON schema for the structured fields plus a plain template for the prose ones.

Why it works best: a standard ships machine-readable, not only as prose. A schema is what lets a copybook be sent, forked, and checked, rather than being a note that only its author can use. It is the difference between a personal habit and a shareable artifact.

### 5. The verifier

What is in it: the checks that hold tuned output to the copybook and the craft. The craft tests from the playbook (Monday, granularity, stated-once, no-fabrication, register-arc). The copybook-conformance check (does the output sit in the exemplars' register, hit the deltas, and obey the hard rules). A uniformity check across the piece (does the voice hold, or does it slip toward the median in stretches), which is the residue-of-drift detector paired with the instrument-model. A multi-lens persona read is available for high-stakes pieces, using the three-reader panel rather than conversion personas.

Why it works best: it closes the loop and makes the rigor enforceable rather than aspirational. The uniformity check in particular is what catches the model reverting to its default in the middle of a piece, which is the failure a single up-front register setting does not prevent.

---

## The Copybook

Six sections, thin by design.

1. Exemplars. Two to four real samples of the target register, and where possible one or two near-misses labeled "not this, and why." Why best: the model mirrors a register from samples with high fidelity and from descriptions poorly; a near-miss teaches the boundary better than a rule, because the contrast shows exactly where the line falls.

2. Intent. What this register is for, who it serves, what it must never do. One short statement. Why best: an example on its own can be mirrored at the surface while its purpose is betrayed; the intent tells the model what to mirror underneath the style.

3. Point of view. Who is speaking, whether there is a "we," the stance to the reader (peer, guide, authority, servant), and the distance. One short statement. Why best: stance is load-bearing and almost always left unstated, and it is one of the things the model most often guesses wrong; naming it fixes a whole class of errors cheaply.

4. Context. The surface, the audience, the medium. One short statement. Why best: the same register reads differently on a landing page, in an email, and in a spec; context sets those defaults so the model does not have to guess them.

5. Deltas. Only the axes where this register departs from neutral, each with its target. Not a full inventory. Why best: listing every axis overloads the reader and the model and quietly rebuilds the setup conversation the copybook exists to remove. Recording only the difference from the default is the literal meaning of the name, tuned to the utterance, not the established default.

6. Hard rules. The non-negotiables for this register (no em dashes, expand abbreviations, banned words, never fabricate). Why best: they are cheap to state and they stop the recurring mistakes before they happen.

---

## The Process

1. Onboarding. The model declares its boundaries and how it works best, and names what stays the person's (the facts, the care, the ownership). Why best: it sets honest expectations, tells the person how to catch the model's drift, and puts the human-only responsibilities where they belong from the start.

2. Ingestion. The person supplies an example of a register they like, as a document, a URL, or pasted text. If they cannot write the register themselves, they point at admired work, or react to candidate samples the model drafts. Why best: recognition is the half the person reliably has; the example is the core input the rest surrounds.

3. Interview. The model extracts intent, point of view, context, deltas, and hard rules around the example. Why best: it converts a raw example into a specification the model can apply without the setup conversation recurring each session.

4. Copybook. The interview output is written into the schema and validated. Why best: it becomes a portable artifact, not a session-bound note.

5. Tuned output. The model writes in the locked register, Engine plus Copybook. Why best: the craft and the instrument-awareness come from the Engine, the target from the Copybook, so the register locks with no ramp.

6. Verify. The output runs the verifier. Why best: it catches the mid-piece reversion to the median that an up-front setting alone does not.

7. Refine and share. The person adjusts the copybook, keeps it, and can send it to someone else. Why best: this is the payoff of the Engine-Copybook split, a personal artifact that travels.

## Where presence lives

Presence is not a section. It is the outcome the structure produces. The copybook's exemplars, intent, and point of view carry the specific author's particular rather than the median, and the instrument-model reserves care, stake, and ownership to the human. Mirroring the particular while reserving the stake is what makes the writing read as authored by a person rather than averaged by a machine. The structure is built to produce that outcome, not to name it on the surface.

## The core start

Build first, the minimum that proves the concept and ships:

- The copybook schema and template (the artifact).
- The Engine's craft baseline (the playbook spine plus the deduplicated Marketing Skills union).
- The instrument-model, first pass, including the onboarding declaration and the top handful of drifts.
- The ingestion and interview protocol, first pass, including the onboarding step and the not-a-good-writer branch.
- One reference copybook: marketing, since that is the register with the most external validation to check the output against.
- A basic verifier: the craft tests, the hard-rules check, and a first uniformity glance.

Defer until the core proves out:

- The full reference set of copybooks (the standards register and a neutral, forkable general one) after marketing lands.
- The persona-panel verifier for high-stakes pieces.
- Deeper instrument-model refinement, corrected against real runs.
- Any sharing or interchange tooling beyond a validatable file.

## Open decisions for the author

- Whether TUNED's center of gravity is the general copy-craft standard or the presence-and-tuning layer that sits on it. The structure above holds either way, but the framing of the published standard follows from it.
- Whether the marketing reference copybook or the standards-register one is the first to author in full.
- Whether the copybook schema is its own small format or is expressed as a constrained agent-instruction file, the "CLAUDE.md for copy" shape.
