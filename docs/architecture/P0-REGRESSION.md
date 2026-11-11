# P0 — Expert / Preservation / Prompt Integrity regression

Scope: Node.js 22 built-in test runner. No npm dependencies or application source modifications.

Run locally:
```sh
node --experimental-default-type=module --test tests/*.test.mjs
```

Coverage:
- Expert registry and domain metadata for eight modes.
- Five-part output contract for each mode.
- Preservation conflicts, target evidence, inferred observation warnings.
- User brief, dimensions, reference authority and source-role integrity.

Limitations: tests check deterministic string/contract behavior, not browser rendering, actual AI image generation, translation fidelity, or PWA caching. A passing suite is not a guarantee of visual fidelity.

Release gate: require green CI, inspect any failures, test desktop/mobile/PWA manually, and obtain approval before merging to main.
