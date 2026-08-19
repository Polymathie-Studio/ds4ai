# Changelog

All notable changes to GRASP are recorded here. This project has not yet cut a numbered release; changes below are unreleased. GRASP is in progress toward the full WAI-ARIA interaction-pattern set (see the scope note); this is tranche one.

## Unreleased

### Added

- Combobox (`<grasp-combobox>`), completing Tier 2: an input paired with a filtered listbox, carrying `role="combobox"`, `aria-expanded`, and `aria-autocomplete`, filtering options as you type, navigating with the arrow keys through `aria-activedescendant` while the input keeps focus, selecting on Enter, and closing on Escape. React `Combobox` added. Tier 3 remains toward the complete set.
- Tier 2b (part one), the behavioral widgets: Tabs (`<grasp-tabs>`, roving focus and arrow-key selection, `aria-selected` and `aria-controls`), Tooltip (`<grasp-tooltip>`, shown on hover and focus, dismissed on Escape, wired with `aria-describedby`), and Accordion (`<grasp-accordion>`, `aria-expanded` disclosure per header, with a `single` mode). React bindings `Tabs`, `Tooltip`, `Accordion` added. Combobox is the remaining Tier 2 widget.
- Tier 2a, the form controls: Checkbox, Radio, Switch, and Select. Native inputs, themed with a visible focus ring, so the keyboard and screen-reader behavior comes from the platform; the switch is a checkbox with `role="switch"` whose motion respects `prefers-reduced-motion`. React wrappers `Checkbox`, `Radio`, `Switch`, `Select`, and they compose with `<grasp-field>` for labels and errors.
- Tranche one, the four most-broken controls: Button (a CSS layer on a real `<button>`), Field (`<grasp-field>`, which wires the label, hint, error, and aria to a native control), Modal (`<grasp-modal>`, built on the native `<dialog>` element for focus trap, Escape, and focus return), and Menu (`<grasp-menu>`, a keyboard-navigable menu).
- The React binding (`grasp-ui/react`): `Button`, `Field`, `Modal`, `Menu`.
- Native-first throughout: builds on `<button>`, native form controls, and `<dialog>`, and hand-rolls behavior only where no native element covers the pattern.
- Accessibility by default: semantic elements, keyboard operation, visible focus, correct ARIA, and a modal that traps and returns focus.
- Theming: every color, space, and size reads a TEMPER token with a fallback.
