// HANDBACK: draws and holds the handback boundary.
// Draws and holds the line between what an instrument hands back to a person
// and what the instrument keeps. Content-neutral: the criteria live in the
// per-build contract; the mechanism here is fixed. Sibling to TEMPER, HASP, LUCID.
//
// The check runs in both directions, which is the whole point:
//   floor:   every near-side element the contract requires is present and equipped,
//            so the machine hands back nothing it could have established itself.
//   ceiling: no far-side marker is emitted as a field, and the handoff is printed,
//            so the machine keeps no verdict that was a person's to make.
// A check with only the ceiling is as much a half-instrument as one with only the floor.

/**
 * @typedef {Object} RequiredElement
 * @property {string} name  Field on the artifact that must be present and non-empty (the kept near-side claim).
 * @property {string[]} [equipment]  For a list-valued element, sub-keys each entry must carry; for an object element, keys it must carry. This is what a person needs to judge the claim: its basis and its bound.
 */

/**
 * @typedef {Object} Contract
 * @property {RequiredElement[]} required  The near side: what the output must carry, each equipped.
 * @property {string[]} forbidden  The far side: substrings no field name in the output may contain.
 * @property {string} [handoff]  The sentence the artifact prints to name what it leaves to a person.
 * @property {string} [handoffField]  Which field carries the handoff (default "handoff").
 */

const isEmpty = (v) =>
  v === undefined ||
  v === null ||
  v === '' ||
  (Array.isArray(v) && v.length === 0);

function collectKeys(value, out) {
  if (Array.isArray(value)) {
    for (const item of value) collectKeys(item, out);
  } else if (value && typeof value === 'object') {
    for (const key of Object.keys(value)) {
      out.push(key);
      collectKeys(value[key], out);
    }
  }
}

/**
 * Check an artifact against a contract in both directions.
 * Returns every violation found; an empty array means the boundary is held.
 * @param {Record<string, any>} artifact
 * @param {Contract} contract
 * @returns {string[]}
 */
export function checkBoundary(artifact, contract) {
  const problems = [];
  if (!artifact || typeof artifact !== 'object') {
    return ['artifact is not an object'];
  }

  // Ceiling, the handoff: the artifact must name what it leaves to a person.
  if (contract.handoff !== undefined) {
    const field = contract.handoffField ?? 'handoff';
    if (artifact[field] !== contract.handoff) {
      problems.push(`handoff: the sentence naming what is handed back is missing or altered on "${field}"`);
    }
  }

  // Floor: every required near-side element present and equipped.
  for (const req of contract.required ?? []) {
    const val = artifact[req.name];
    if (isEmpty(val)) {
      problems.push(`${req.name}: required near-side element absent (floor: handing back what the machine should establish)`);
      continue;
    }
    if (req.equipment && req.equipment.length > 0) {
      const entries = Array.isArray(val) ? val : [val];
      entries.forEach((entry, i) => {
        const where = Array.isArray(val) ? `${req.name}[${i}]` : req.name;
        for (const eq of req.equipment) {
          if (!entry || typeof entry !== 'object' || isEmpty(entry[eq])) {
            problems.push(`${where}: missing equipment "${eq}" (the judge is not equipped to check this claim)`);
          }
        }
      });
    }
  }

  // Ceiling, the far side: no forbidden marker may appear as a field name anywhere.
  const keys = [];
  collectKeys(artifact, keys);
  const forbidden = (contract.forbidden ?? []).map((f) => f.toLowerCase());
  for (const key of keys) {
    const lower = key.toLowerCase();
    for (const marker of forbidden) {
      if (lower.includes(marker)) {
        problems.push(`forbidden far-side field "${key}" (ceiling: a verdict the machine may not keep)`);
      }
    }
  }

  return problems;
}

/** Audit: return every violation, never throws. Adopt where the host checks finished artifacts. */
export const audit = checkBoundary;

/** Guard: throw on any build that violates the contract. Adopt where the host refuses at construction. */
export function guard(artifact, contract) {
  const problems = checkBoundary(artifact, contract);
  if (problems.length > 0) {
    throw new Error(`boundary violated:\n  ${problems.join('\n  ')}`);
  }
  return artifact;
}

/** Mark a value as handed back to a person, so it renders as the person's and never as a machine conclusion. */
export function handBack(label, value, equipment) {
  return { handedBack: true, label, value, ...(equipment ? { equipment } : {}) };
}
