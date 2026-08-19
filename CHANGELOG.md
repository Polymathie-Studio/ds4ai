# Changelog

All notable changes to GRACE are recorded here. This project has not yet cut a numbered release; changes below are unreleased.

## Unreleased

### Added

- The framework-agnostic core (`grace.js`, `grace.css`): a CSS skeleton for the pending state, and three custom elements for the absent, failed, and unreachable states (`<grace-empty>`, `<grace-error>`, `<grace-notfound>`), each rendering an accessible state from attributes.
- The React binding (`grace-states/react`): `Skeleton`, `Empty`, `ErrorState`, and `NotFound`.
- Accessibility by default: the error uses an assertive live region, empty and not-found use a polite one, actions are real buttons or links, and the skeleton pulse respects `prefers-reduced-motion`.
- Theming: every color, space, and size reads a TEMPER semantic token with a fallback, so GRACE follows a TEMPER theme where present and renders clean where absent.
