# DS4AI, the Design Suite for AI

DS4AI fills the layer an AI skips when it builds a web surface: the parts that never show in a demo but are present when the work is done right and conspicuously absent when it is not. It is a set of drop-in instruments under one umbrella standard, **MISSING**, which defines what a finished front end must cover and ships an auditor for it.

This repository consolidates the suite. Each standard lives under `standards/<name>/` with its full history; shared mechanisms live under `modules/`.

## The umbrella

- **[MISSING](standards/missing/)** the standard at the center of the suite: the map, the family manifest, and the conformance auditor. It names the axes of invisibility, routes each to the instrument that closes it, and checks a surface against them.

## The instruments

| Axis | Instrument |
| --- | --- |
| Perceivable by any reader | **[TEMPER](standards/temper/)** color solved to contrast floors |
| Operable | **[GRASP](standards/grasp/)** keyboard and screen-reader controls |
| Understandable | **[LUCID](standards/lucid/)** layered disclosure |
| Resilient | **[GRACE](standards/grace/)** loading, empty, and error states |
| Key-private | **[HASP](standards/hasp/)** the user's model key stays in their browser |
| Findable | **[BEACON](standards/beacon/)** metadata a crawler and a share can read |
| Fast and stable | **[FLEET](standards/fleet/)** delivery tuned to the Core Web Vitals |
| Tuned to the words | **[TUNED](standards/tuned/)** written to the utterance, not the established default |

## Shared modules

- **[HANDBACK](modules/handback/)** draws and holds the line between what an instrument hands back to a person and what it keeps. Content-neutral mechanism, per-build criteria; shared by several instruments.

## Machine-readable layer

The suite's machine-readable layer (schemas, registers, and the family manifest) lives at the one source, [Polymathie-Studio/tools](https://github.com/Polymathie-Studio/tools), as the DS4AI family manifest ([ds4ai-manifest.json](https://raw.githubusercontent.com/Polymathie-Studio/tools/main/schema/ds4ai/ds4ai-manifest.json)), alongside the other standards families.
