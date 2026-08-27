# One Click for ChatGPT

One Click converts a rough business idea into a structured handoff for the installed Lovable plugin. This repository is intentionally separate from the existing One Click website.

## Capability split

- **Initial release:** anonymous, ephemeral, lightweight website handoff.
- **Lovable:** the separately installed Lovable plugin performs project creation and subsequent code changes. One Click does not imitate Lovable or use the legacy prompt-fragment URL.
- **Later release:** authenticated saved projects and Full Mode remain in the product roadmap and are not exposed until their OAuth connection can be reviewed end to end.

## MCP

Production endpoint: `https://oneclick-chatgpt.woeinvests.workers.dev/mcp`

The Worker also understands the `/oneclick-chatgpt-plugin` path prefix when a branded Cloudflare route is provisioned for the website domain.

Tool:

- `oneclick_prepare_basic_draft`

The GitHub deployment workflow needs `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` repository secrets. No One Click account or Supabase secret is needed for this release.

## Development

```sh
npm run check
npm run deploy:dry
npm run deploy
npm run smoke:production
```

Analytics Engine records coarse invocation telemetry only. It deliberately excludes prompts, business names, URLs, project IDs, tokens, IPs, raw headers and stable user identifiers.
