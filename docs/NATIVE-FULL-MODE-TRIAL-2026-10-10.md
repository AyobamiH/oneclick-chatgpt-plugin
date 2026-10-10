# Native Full Mode trial candidate

This branch adds a gated MCP Extensions workspace while preserving the published Basic endpoint and immutable publisher identity. Native entrypoints use empty inputs, distinct global/thread titles, a bundled HTML resource and the released @openai/mcp-extensions 0.1.0 API. Package/manifest 1.0.3 remains the current submission; this code is a 1.1.0 candidate and must not be represented as already published.

Full Mode includes the owned website prompt engine, nine style presets, eleven layouts, preferred headlines/CTAs and public HTTPS image/reference links, a separate knowledge draft, structured developer insights, SEO/accessibility/security implementation requirements, a five-sprint roadmap, saved projects, versioned knowledge editing, escaped handoff packs, editable SVG monogram/palette/typography kits and developer support tickets. It never creates or deploys an external website.

The CTA is **Try at no cost — 3-day Full Mode trial**. Duration, no-card/no-auto-charge terms and optional **£100 once** lifetime continuation are disclosed before the form. Trial activation requires an explicit checkbox; the payment button appears after expiry and only when payments are actually ready. Trial and paid balances are separate. Agency services and bespoke AI logo generation are not implied by this offer.

Account OAuth uses PKCE, exact resource audience, short-lived tokens, explicit connection consent and current server-side ownership/access checks. No password or token enters UI form/tool arguments. The iframe uses only host-mediated calls; it does not fetch account services directly or persist credentials. Read-only account operations can be exposed to the model; trial, save, support and checkout writes are app-only controls.

## Activation and release gates

- Defaults remain `ONECLICK_NATIVE_ENABLED=false` and `ONECLICK_FULL_MODE_READY=false` unless explicitly configured. Existing production config omits both flags.
- Full Mode requires the additive backend branch `feat/full-mode-trial-20261010`, migrations 0010–0011, `PLUGIN_OAUTH_ENABLED`, canonical `PLUGIN_MCP_RESOURCE`, a stable `TRIAL_IDENTITY_SECRET`, and accepted existing account migration.
- A separate synthetic-account review environment is deployed and has passed the hosted account, consent, trial, project, branding, knowledge and expiry flow. Customer sign-up and payments must remain disabled there; no production customer imports.
- Before public release, complete production-account migration acceptance, hosted real-account/MFA/Checkout return acceptance, update the retained MCP package/version/skill around the final endpoint, publish matching plugin-specific policies at the main website `/chatgpt/privacy/` and `/chatgpt/terms/`, then submit the candidate version for publisher review. Original website `/privacy` and `/terms` stay separate.
- Native host integration improves the installed experience. It does not establish catalogue indexing, recommendation placement, organic traffic or unique installs. Prior limited plugin search did not reliably retrieve OneClick even though directory search found it; that discovery gap remains open.

## Validation

`npm run check`: 54 passing tests, including the real SDK UI handshake, service readiness, explicit trial consent, expiry refresh/payment prompt, no automatic checkout, isolated resources, Basic compatibility, OAuth challenges and backend-origin validation. Build generation uses replacement callbacks so bundled JavaScript cannot be corrupted by replacement-string metacharacters. Generated bundles are reproducible and ignored; run `npm run build:native` before deployment.

Reference: https://github.com/openai/mcp-extensions (source reviewed at 0d606217705e0e71eb21fff009619b67b80611dc). Current specification lists native extension support for ChatGPT Work; classic ChatGPT is not listed as supported. Do not promise universal paid-user coverage.

## Hosted review

- Native service: https://oneclick-chatgpt-native-review.woeinvests.workers.dev/mcp
- Review website and dedicated policies: https://oneclick-trial-review.woeinvests.workers.dev/chatgpt/
- Receipt: NATIVE-TRIAL-HOSTED-ACCEPTANCE-2026-10-10.json
- Desktop/mobile captures are visual fixtures in docs/images; real SDK handshake and interactions are separately tested.

The hosted receipt records an isolated synthetic account and new review database, no customer imports, disabled payments and unchanged production Basic 1.0.3. It does not claim real Checkout acceptance or public plugin publication. Trial expiry was simulated only in the synthetic database. No customer credentials are included in the repository.
