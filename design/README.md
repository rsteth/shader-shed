# Shader Shed local catalog

Run npm run build, then `node design/serve.mjs`. Preview: http://127.0.0.1:8795/. `/_sandbox` embeds the real page with only allow-scripts. The local server allowlists assets, binds loopback, and sends no external requests. No production source changes. Tokens document native source values, not a new runtime theme. Both OS color preferences retain native dark appearance.

Reload resets fixture state. Shader time remains live because the source has no freeze-time API. Slideshow has no manual controls and currently only one included sketch, Eclipse Weave.

License: No repository license found. Keep local only and retain existing sketch attribution.

Verification results will be recorded after testing.

## Verified gates

Production hash check and all existing application gates passed. Strict sandbox keyboard operation, repeated controls, reload reset, and denials for .git/config, package.json and design source hashes passed. Browser sweep evidence is separate; recorded results do not imply identical GPU output.

The preview CSP allows unsafe-eval because the existing regl renderer generates functions. It remains loopback-only with an asset allowlist and external requests prohibited. The dedicated /sketches/[id] article layout is not separately exposed; its source content is covered through 11 About fixtures.

Browser sweep: 64 fixture observations across desktop 1280×800/dark and mobile 390×844/light OS preferences, direct and allow-scripts-only iframe. All ready with canvas, zero uncaught page errors. Local evidence in design/evidence; observations in design/browser-results.json. Native source appearance stays dark. Canonical theme-adapter.mjs is hash-pinned; theme.mjs verifies actual source palette before nonce acknowledgement and disposes on pagehide.

Final theme protocol checks passed: correct dark nonce acknowledged, unsupported light and missing nonce rejected. Keyboard/repeated/reset and production source hashes rechecked after adapter integration. Direct Cloud High reached native Volumetric status on desktop and mobile; sandbox High accurately remained Low. Shader About equation clipping at narrow width is pre-existing source layout, preserved rather than redesigned. No captures claim cross-GPU determinism.
