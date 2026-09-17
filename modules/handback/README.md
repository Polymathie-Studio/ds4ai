# HANDBACK

Draws and holds the line between what an instrument hands back to a person and what it keeps. Content-neutral: the criteria live in a per-build contract, the mechanism here is fixed. The keystone of the reusable-module family in DS4AI, shared by several instruments and sibling in construction to TEMPER (color), HASP (keys), and LUCID (disclosure).

## Use

Declare a contract for your instrument's output: the near-side elements it must carry (each with the equipment a person needs to judge it), the far-side markers it must never emit as a field, and the handoff it prints.

```js
import { audit, guard, handBack } from './index.js';

const contract = {
  required: [
    { name: 'claim' },
    { name: 'support', equipment: ['grade', 'ultimateOrigins'] },
    { name: 'refutationConditions' },
  ],
  forbidden: ['score', 'worth', 'verdict', 'rating', 'risk'],
  handoff: 'What this is worth is a decision for a person.',
};

audit(artifact, contract); // string[] of violations; [] means the line is held
guard(artifact, contract); // throws on the first violation (construction-time refusal)
```

`audit` checks both directions: the floor (every near-side element present and equipped, nothing abdicated) and the ceiling (no far-side field emitted, the handoff printed). `guard` is the same check as a construction-time refusal, so a host adopts whichever mode it can run. `handBack(label, value)` marks a value as the person's, never a machine conclusion.

## The four reduce to one

`test.mjs` encodes four real instrument shapes as four contracts on this one mechanism (an evidence finding, a disclosure node, a roadmap stage, and a shape reading). Each real shape passes its own contract; floor and ceiling violations are caught. Run `node test.mjs`.
