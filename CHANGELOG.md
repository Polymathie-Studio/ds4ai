# Changelog

All notable changes to GRASP are recorded here. This project has not yet cut a numbered release; changes below are unreleased. GRASP is in progress toward the full WAI-ARIA interaction-pattern set (see the scope note); this is tranche one.

## Unreleased

### Added

- Tranche one, the four most-broken controls: Button (a CSS layer on a real `<button>`), Field (`<grasp-field>`, which wires the label, hint, error, and aria to a native control), Modal (`<grasp-modal>`, built on the native `<dialog>` element for focus trap, Escape, and focus return), and Menu (`<grasp-menu>`, a keyboard-navigable menu).
- The React binding (`grasp-ui/react`): `Button`, `Field`, `Modal`, `Menu`.
- Native-first throughout: builds on `<button>`, native form controls, and `<dialog>`, and hand-rolls behavior only where no native element covers the pattern.
- Accessibility by default: semantic elements, keyboard operation, visible focus, correct ARIA, and a modal that traps and returns focus.
- Theming: every color, space, and size reads a TEMPER token with a fallback.
