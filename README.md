# One Click for ChatGPT

One Click converts a small set of task-specific website requirements into a structured handoff for the separately installed Lovable plugin. This repository is intentionally separate from the existing One Click website.

## Capability boundary

- **Current release:** no-account, ephemeral Basic Mode website handoff.
- **One Click tool:** prepares the brief only. It does not create, publish or deploy a website and it does not persist the business brief.
- **Lovable:** a separate external write path used only after the user authorises project creation.
- **Later release:** authenticated saved projects and Full Mode remain outside the exposed tool catalogue until reviewed independently.

## MCP

Production endpoint: `https://oneclick-chatgpt.woeinvests.workers.dev/mcp`

Tool:

- `oneclick_prepare_basic_draft`

Required inputs are only `industry` and `primary_goal`. Optional inputs are limited to `business_name`, `brand_vibe`, `headline`, `call_to_action`, `layout` and `services`. The API rejects unexpected properties, wrong types, unsupported layouts and oversized requests. It does not accept full conversation history, inferred location, generic catch-all notes or reference-image URLs.

### Tool annotations

`oneclick_prepare_basic_draft` explicitly declares:

- `readOnlyHint: false` because a minimal operational analytics event may be appended for each tool invocation.
- `destructiveHint: false` because it does not delete or overwrite customer state.
- `openWorldHint: false` because it does not browse arbitrary URLs or invoke external services.

Analytics Engine records only tool name, success/error, rounded latency, release version and coarse client family. Application-level analytics deliberately exclude prompt text, business brief content, business names, URLs, project IDs, tokens, IPs, raw headers and stable user identifiers.

## Development and release

```sh
npm run check
npm run deploy:dry
npm run deploy
npm run smoke:production
```

Production pushes require `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`. The deployment workflow runs the full checks, deploys the Worker and then verifies the live MCP catalogue, annotations, narrowed schema, a valid call and rejection of broad input.
