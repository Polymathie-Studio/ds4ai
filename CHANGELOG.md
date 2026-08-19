# Changelog

All notable changes to HASP are recorded here. This project has not yet cut a numbered release; changes below are unreleased.

## Unreleased

### Changed

- Any key whose provider is not recognized is now held as `other` instead of being silently labeled `anthropic`. The stored provider is never a privileged guess. This makes "any-provider" literally true: HASP holds any key and never mislabels it.
- `setKey` accepts an explicit provider, so a user's or an app's choice wins over auto-detection.
- The key modal shows a provider select (prefilled from detection, changeable) instead of guessing, and on reopen it shows the provider a key was actually stored under rather than re-guessing from the key.
- HASP now ships compiled ESM plus type declarations, built with `tsc`, instead of raw TypeScript source. Consumers no longer need a TypeScript-aware bundler to use it.
- License changed from MIT to Apache-2.0, with a `NOTICE` file, so the whole Polymathie family shares one code license.
- The key modal's default styling now reads TEMPER's semantic tokens with fallbacks, so it follows a TEMPER theme (light, dark, or reader-tuned) when present and renders the same standalone.

### Fixed

- The compiled ESM uses explicit `.js` import extensions, so it runs in a native browser module load and in strict Node ESM, not only under a bundler.
