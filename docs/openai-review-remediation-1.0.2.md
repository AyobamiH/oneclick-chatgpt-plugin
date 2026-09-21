# One Click 1.0.2: privacy review remediation

## Review state and scope

OpenAI rejected One Click 1.0.1 on 21 September 2026 for an incomplete privacy policy. The feedback requires disclosure of collected data, purposes, recipients, retention and user controls, reflecting current tool inputs and outputs.

This release implements that remediation. It does not itself submit a new version, claim approval, or publish a directory listing. The 10 September 1.0.1 receipt and videos remain historical evidence; do not describe them as a fresh 1.0.2 review or demonstration.

- Publisher app: `asdk_app_698c5319a3c8819180537c0c37cde979`
- Candidate release: **1.0.2**
- Tool: `oneclick_prepare_basic_draft`
- Public privacy URL: https://oneclick-chatgpt.woeinvests.workers.dev/privacy
- Public support URL: https://oneclick-chatgpt.woeinvests.workers.dev/support
- Owner-selected contact: `john@tailwaggingwebdesign.com`
- Publisher dashboard: https://platform.openai.com/plugins

## Finding-to-implementation map

| Reviewer requirement | Implemented disclosure/control | Evidence location |
| --- | --- | --- |
| Data collected | All eight fields, purposes and limits; generated brief and prompt; operational event categories including Cloudflare timestamps; network metadata and support correspondence | `src/pages.js`, `src/tools.js`, `src/draft.js`, `src/analytics.js` |
| Purposes | Brief preparation, reliability/aggregate usage, hosting/security and support/rights handling; no profiling, advertising, sale or model training by this service | Privacy sections 1 and 5 |
| Recipients | Cloudflare, OpenAI/chosen client, separately authorised Lovable action, operator and email providers; independent client/provider copies distinguished | Privacy section 2 |
| Retention | Request-only brief processing, three-month Analytics Engine expiry, up-to-seven-day historical Worker logs, 90-day-after-closure support process and exceptional holds; provider-controlled copies explicitly qualified | Privacy section 3; `docs/privacy-operations.md` |
| User controls | Optional-field minimisation, decline/disconnect, review before external handoff, direct-MCP DNT/GPC suppression, private rights requests and limits of per-user analytics deletion | Privacy sections 4–5; `/support`; privacy regression tests |

## Runtime fixes supporting the disclosure

1. Replace the old analytics character filter with fixed tool/outcome allowlists. An arbitrary unrecognised tool label cannot be stored as a user-supplied string.
2. Bound numeric event values and omit raw request properties and exception details.
3. Return stable validation error codes rather than reflecting unexpected field names. Unexpected exceptions are handled without returning internal text/stack content.
4. Honour `DNT: 1` and `Sec-GPC: 1` for the custom event, without changing the brief or creating a cookie/identity record. This does not control essential provider network processing, and ChatGPT is not represented as exposing a custom-header UI.
5. Disable stored Worker logs, invocation logs and Logpush. Read the deployed settings to catch enabled traces/tail/export destinations and configuration drift.

## Preserved review fixes

The public input schema remains exactly eight website-specific fields, with `industry` and `primary_goal` required. Full conversation history, arbitrary extra properties, account credentials, location and reference URLs remain outside the accepted schema. Basic Mode is anonymous and does not create, save or deploy projects.

The explicit annotations remain:

- `readOnlyHint: false`: a minimal operational event may be appended unless the per-request control suppresses it.
- `destructiveHint: false`: the tool does not delete or overwrite customer project state.
- `openWorldHint: false`: preparation operates on bounded supplied fields; it does not browse, invoke Lovable or access open-ended external entities.

The release/server version is **1.0.2**. The unchanged handoff format retains `schemaVersion: 1.0.1`; a schema version is not the app release number. The existing preparation skill remains applicable because its tool contract has not expanded.

## Validation and evidence

Local checks:

```sh
npm run check
npm run deploy:dry
```

The protected deploy workflow pins the same Wrangler version and then runs:

```sh
npm run verify:privacy
npm run smoke:production
```

A successful run produces an artifact named `oneclick-review-evidence-<commit>` with:

- `oneclick-privacy-settings.json`: effective disabled logging/export checks, the fixed API source and any observed inactive logging preferences. Cloudflare may retain true persistence/invocation preferences while collection is disabled, so the receipt distinguishes those preferences from active collection. It contains no credentials or raw binding/settings dump.
- `oneclick-live-review.json`: observed service version, public-page hashes and HTTP/MCP checks. It is protocol evidence, not a ChatGPT UI recording or OpenAI approval.

The runtime tests cover sensitive markers in unknown tool names and fields, arbitrary exceptions, analytics failures, DNT/GPC suppression, fixed labels/numeric bounds and the unchanged handoff. Live smoke verifies the full privacy/support pages and their contact, release identity, exact tool schema/annotations, successful synthetic preparation, opt-out compatibility and sanitised failure paths.

Support mailbox delivery, actual support-case deletion and provider backup erasure are not established by these tests. The owner-selected contact and retention procedure are operational commitments, not invented automated features.

Historical analytics: the new allowlist does not rewrite old rows. Start any historical assessment with an aggregate-only nonstandard-label count; a positive result does not by itself establish personal data. Do not select or publish raw labels/briefs for a public evidence record.

## Resubmission preparation

After the deployment and both post-deploy checks succeed:

1. Open the existing app in the publisher dashboard and confirm the current review decision. Create/update a candidate for 1.0.2; do not create a duplicate app.
2. Confirm the submitted privacy/support URLs above and the owner-selected email. Verify the full updated policy opens without authentication.
3. Refresh the live tool scan and check the one-tool catalogue, unchanged bounded inputs and explicit false/false/false annotations. Use the justifications above.
4. Add the current deployment/verification receipts and the following release note. Preserve older evidence with its actual version/date; if the publisher requires a fresh 1.0.2 UI demonstration, record it against the deployed candidate.
5. Review the final publisher declarations and submit only as a separate authorised distribution action. No submission is performed by this implementation workflow.

### Prepared release note

One Click 1.0.2 addresses the privacy-policy feedback for 1.0.1. The public policy now explains the accepted website fields and generated output, operational analytics and network processing, recipients, category-specific retention and user controls. It provides a direct private contact and an operational support-retention procedure. The runtime now restricts analytics to fixed categories, suppresses operational events for DNT/GPC requests, sanitises error messages and disables stored Worker logging/exports. Basic Mode, the bounded eight-field input schema and explicit tool annotations remain intact.

## Primary guidance used

- [OpenAI plugin guidelines: privacy](https://developers.openai.com/plugins/app-guidelines#privacy)
- [Cloudflare Analytics Engine retention](https://developers.cloudflare.com/analytics/analytics-engine/limits/#data-retention)
- [Cloudflare Analytics Engine timestamps](https://developers.cloudflare.com/analytics/analytics-engine/get-started/#working-with-time-series-data)
- [Workers Logs](https://developers.cloudflare.com/workers/observability/logs/workers-logs/)
- [ICO privacy-information guidance](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/individual-rights/the-right-to-be-informed/what-privacy-information-should-we-provide/)
