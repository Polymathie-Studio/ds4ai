# GRASP

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/grasp-overview-dark.svg">
  <img alt="GRASP overview: why it exists (a div is not a button, a modal with no focus trap locks out the keyboard, a field with no label is silent to a screen reader), what it provides (twenty-one native-first accessible components across the WAI-ARIA common working set, themed by TEMPER), that keyboard and screen-reader behavior come from the platform, and how it differs from div soup, UI kits, headless libraries, and nothing." src="assets/grasp-overview-light.svg" width="1200">
</picture>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/grasp-render-dark.png">
  <img alt="GRASP components: a row of button variants, a form field with its label, hint, and error wired, and an open menu with keyboard-navigable items." src="assets/grasp-render-light.png" width="900">
</picture>

GRASP is operable interaction components: the controls AI builds get wrong. A div is not a button, a modal that opens but never traps focus locks out a keyboard, a field with no wired label is silent to a screen reader, and a dropdown built from divs cannot be reached with the Tab key. GRASP gives you those controls built right, semantic, keyboard-operable, and screen-reader ready by default, themed by TEMPER.

It covers the common working set of interaction patterns that need accessibility (the WAI-ARIA Authoring Practices patterns; see the scope note): all of Tiers 1 to 3, which is Button, Field, Modal, Menu, Checkbox, Radio, Switch, Select, Tabs, Tooltip, Accordion, Combobox, Slider, Spinbutton, Progress and Meter, Breadcrumb, Toggle group, Toolbar, Toast, and Popover. Tier 4 is the acknowledged extension tail (date picker, table and grid, tree, and the rest), added as needed and marked not-yet-covered rather than pretended. GRASP stays **0.x** until a numbered release is cut.

No build step is required. The framework-agnostic core is one small ES module and one CSS file, with a React binding alongside. The package name is `grasp-ui`; it is planned for npm but not yet published.

## Native-first

GRASP builds on the semantic element wherever one exists and hand-rolls behavior only where none does. The button is a real `<button>`; the field wires native inputs; the modal is the native `<dialog>` element, which gives a focus trap, Escape, and focus return for free. A custom widget appears only where the platform has no element for the pattern (the menu).

## The components

- **Button**: `.grasp-button` on a real `<button>` or `<a>`, with variants (primary, secondary, ghost, danger), a disabled and a busy state, and a visible focus ring.
- **Field**: `<grasp-field>` wires the label to the control, the error and hint via `aria-describedby`, marks `aria-invalid`, and shows a required indicator, all the wiring builders skip.
- **Modal**: `<grasp-modal>` wraps a native `<dialog>`; opening moves focus in and traps it, Escape and a backdrop click close, and focus returns to the trigger.
- **Menu**: `<grasp-menu>` carries `aria-haspopup` and `aria-expanded`, opens on click or the arrow keys, navigates with Up, Down, Home, and End, and closes on Escape or an outside click, returning focus to the trigger.
- **Form controls**: Checkbox, Radio, Switch, and Select, native inputs styled and themed with a visible focus ring, so the keyboard and screen-reader behavior comes from the platform. The switch is a checkbox with `role="switch"`, and its motion respects `prefers-reduced-motion`. Wrap any of them in `<grasp-field>` for the label and error wiring.
- **Tabs**: `<grasp-tabs>` wires a tablist and panels with roving focus (arrow keys, Home, End), `aria-selected`, and `aria-controls`, showing one panel at a time.
- **Tooltip**: `<grasp-tooltip text="...">` shows a bubble on hover and focus, dismisses on Escape, and wires `aria-describedby` so a screen reader reads it.
- **Accordion**: `<grasp-accordion>` (add `single` for one open at a time) wires each header button's `aria-expanded` and `aria-controls` to its panel.
- **Combobox**: `<grasp-combobox>` pairs an input with a filtered listbox, carrying `role="combobox"`, `aria-expanded`, and `aria-autocomplete`; it filters options as you type, navigates with the arrow keys through `aria-activedescendant` (the input keeps focus), selects on Enter, and closes on Escape.
- **Slider**: `.grasp-slider` on a native `<input type="range">`, themed with a visible focus ring; the keyboard behavior and `role="slider"` come from the platform.
- **Spinbutton**: `.grasp-spinbutton` on a native `<input type="number">`, themed like a field control, with the native stepper and `role="spinbutton"`. Wrap it in `<grasp-field>` for the label and error wiring.
- **Progress and Meter**: `.grasp-progress` on a native `<progress>` (a determinate or, with no `value`, indeterminate progressbar) and `.grasp-meter` on a native `<meter>` (a static gauge), each carrying its native role.
- **Breadcrumb**: `.grasp-breadcrumb` on a `<nav aria-label="Breadcrumb">` wrapping an `<ol>`, with the current page marked `aria-current="page"`. Semantics only, no script.
- **Toggle group**: `.grasp-toggle-group` wraps native radios (single-select) or checkboxes (multi-select) styled as a segmented control. The input is visually hidden but operable, so the keyboard and screen-reader behavior come from the platform; put `role="group"` and an `aria-label` on the wrapper.
- **Toolbar**: `<grasp-toolbar>` carries `role="toolbar"`, gives the group a single tab stop, and moves focus between its buttons with the arrow keys, Home, and End (add `orientation="vertical"` for up and down).
- **Toast**: `<grasp-toast-region>` is a live region with a `show(message, opts)` method; the exported `toast(message, opts)` helper pushes onto a default region, creating it on first use. Each toast is `role="status"` (polite) or, with `assertive`, `role="alert"`, carries a dismiss button, and auto-dismisses after a duration; the entrance animation respects `prefers-reduced-motion`.
- **Popover**: `<grasp-popover>` builds on the native Popover API, so show, hide, light-dismiss, Escape, and the top layer come from the platform; GRASP wires `popovertarget`, reflects `aria-expanded`, and positions the panel by the trigger.

## Quickstart

### Any site, no framework

```html
<link rel="stylesheet" href="/grasp.css">
<script type="module" src="/grasp.js"></script>

<button class="grasp-button grasp-button--primary">Save</button>

<grasp-field label="Email" error="That email is not valid.">
  <input type="email" required>
</grasp-field>

<grasp-modal heading="Edit profile" id="dialog">
  <p>Content goes here.</p>
</grasp-modal>
<button class="grasp-button" onclick="dialog.open()">Edit</button>

<grasp-menu>
  <button class="grasp-menu__trigger grasp-button grasp-button--secondary">Actions</button>
  <div class="grasp-menu__list">
    <button>Rename</button>
    <button>Delete</button>
  </div>
</grasp-menu>
```

### React

```tsx
import 'grasp-ui/grasp.css'
import { Button, Field, Modal, Menu } from 'grasp-ui/react'

function Example() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>Edit</Button>
      <Field label="Email" error={error}><input type="email" required /></Field>
      <Modal open={open} onClose={() => setOpen(false)} heading="Edit profile">
        <p>Content goes here.</p>
      </Modal>
      <Menu label="Actions" items={[
        { label: 'Rename', onSelect: rename },
        { label: 'Delete', onSelect: remove },
      ]} />
    </>
  )
}
```

## Accessibility

Every control is a semantic element or carries the correct role, is operable by keyboard alone with a visible focus ring, and exposes an accessible name. The modal traps and returns focus through the native `<dialog>`; the menu manages roving focus and `aria-expanded`; the field wires labels and errors to the control so a screen reader reads them. This is the point of the primitive: the accessibility a build otherwise skips is here by construction.

## Composing with TEMPER

GRASP reads TEMPER's semantic tokens (surface, border, text, accent, danger, focus ring, plus the spacing and type scales) with a fallback for each. Set a TEMPER mode on the root and GRASP follows it; where TEMPER is absent, the fallbacks render a clean neutral control.

## Part of DS4AI, the Design Suite for AI

GRASP is one instrument in **DS4AI, the Design Suite for AI, from [Polymathie-Studio](https://github.com/Polymathie-Studio)**: small, dependency-free pieces that each close one axis of the *invisible-correctness layer*, the part of a shipped surface a look-at-it review cannot see and that fast, AI-assisted building drops.

- **[TEMPER](https://github.com/Polymathie-Studio/temper)**: perceivable, color and design tokens
- **[GRASP](https://github.com/Polymathie-Studio/grasp)**: operable, interaction components
- **[LUCID](https://github.com/Polymathie-Studio/lucid)** + **[GRACE](https://github.com/Polymathie-Studio/grace)**: honest off the happy path, disclosure and state components
- **[HASP](https://github.com/Polymathie-Studio/hasp)**: hardened, client-surface security posture
- **[BEACON](https://github.com/Polymathie-Studio/beacon)**: findable, head metadata and site files
- **[FLEET](https://github.com/Polymathie-Studio/fleet)**: fast and stable, delivery

**[MISSING](https://github.com/Polymathie-Studio/missing)** is the standard at the center of DS4AI: it names the axes, routes each to its instrument, and ships a machine-readable manifest and a conformance auditor. Adopt one and the others compose with it.

## License

Apache-2.0. Copyright 2026 Regis Lloyd Chapman. See `LICENSE` and `NOTICE`.
