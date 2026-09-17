import { audit, guard, handBack } from './index.js';

let failures = 0;
const ok = (name, cond) => {
  if (!cond) {
    failures++;
    console.log('FAIL ', name);
  } else {
    console.log('pass ', name);
  }
};

// The four hand-built copies, expressed as four contracts on the one mechanism.
// Each real shape passes its own contract; floor and ceiling violations are caught.

// 1. ASSAY finding
const ASSAY_HANDOFF =
  'This finding establishes what the pinned evidence supports and where it is contested. ' +
  'What it is worth, and what should be done about it, are decisions for a person.';
const assay = {
  required: [
    { name: 'claim' },
    { name: 'support', equipment: ['grade', 'ultimateOrigins'] },
    { name: 'independence', equipment: ['rung'] },
    { name: 'refutationConditions' },
  ],
  forbidden: ['score', 'worth', 'verdict', 'rating', 'risk'],
  handoff: ASSAY_HANDOFF,
};
const finding = {
  claim: 'X depends on Y',
  support: [{ recordId: 'r1', grade: { code: 'B2' }, ultimateOrigins: ['o1'] }],
  independence: { rung: 'dual' },
  refutationConditions: ['a primary source contradicts Y'],
  handoff: ASSAY_HANDOFF,
};
ok('assay: a well-formed finding passes', audit(finding, assay).length === 0);
ok('assay: dropped refutation conditions trip the floor',
  audit({ ...finding, refutationConditions: [] }, assay).some((p) => p.includes('refutationConditions')));
ok('assay: unequipped support (no grade) trips the floor',
  audit({ ...finding, support: [{ recordId: 'r1' }] }, assay).some((p) => p.includes('grade')));
ok('assay: a riskScore field trips the ceiling',
  audit({ ...finding, riskScore: 0.8 }, assay).some((p) => p.includes('forbidden')));
ok('assay: an altered handoff trips the ceiling',
  audit({ ...finding, handoff: 'trust me' }, assay).some((p) => p.includes('handoff')));

// 2. LUCID disclosure node  (drill-to-source is the equipment)
const lucid = {
  required: [{ name: 'gloss' }, { name: 'source' }],
  forbidden: ['verdict', 'rating', 'score'],
};
const node = { gloss: 'quadratic funding matches by breadth of support', source: '/refs/qf.md#matching' };
ok('lucid: a disclosure with a path to source passes', audit(node, lucid).length === 0);
ok('lucid: no drill-to-source trips the floor',
  audit({ gloss: 'x' }, lucid).some((p) => p.includes('source')));

// 3. Woodshed roadmap stage  (deaths are the equipment)
const roadmap = {
  required: [{ name: 'disciplines' }, { name: 'deaths' }],
  forbidden: ['verdict', 'score', 'placement', 'rating'],
};
const stage = {
  name: 'Validate the problem',
  disciplines: ['talk to real people in the affected group'],
  deaths: ['building before validating'],
};
ok('roadmap: a stage stating its do\'s and its failure modes passes', audit(stage, roadmap).length === 0);
ok('roadmap: a stage that placed the founder trips the ceiling',
  audit({ ...stage, founderPlacement: 'behind' }, roadmap).some((p) => p.includes('forbidden')));

// 4. Woodshed shape reading  (notWrong is the equipment)
const shape = {
  required: [{ name: 'evidence' }, { name: 'notWrong' }],
  forbidden: ['verdict', 'score', 'rating'],
};
const reading = {
  label: 'Making a market',
  evidence: 'demonstration resonance, a dated why-now, real leading-edge pull',
  notWrong: 'absent demand is the starting condition, not a verdict against the idea',
  revenueIsProof: false,
};
ok('shape: a reading with possible-evidence and notWrong passes', audit(reading, shape).length === 0);
ok('shape: revenueIsProof is a structural flag, not a forbidden verdict', audit(reading, shape).length === 0);

// The two enforcement modes, and the handoff marker.
let threw = false;
try { guard({ ...finding, refutationConditions: [] }, assay); } catch { threw = true; }
ok('guard refuses at construction', threw);
ok('handBack marks an item as the person\'s', handBack('worth', 'to be decided').handedBack === true);

console.log(
  failures === 0
    ? '\nALL PASS. The four reduce to one mechanism.'
    : `\n${failures} FAILED.`,
);
process.exit(failures === 0 ? 0 : 1);
