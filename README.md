# One Click for ChatGPT

One Click converts a business brief or an authenticated saved One Click project into a structured handoff for the installed Lovable plugin. This repository is intentionally separate from the existing One Click website.

## Capability split

- **Basic Mode:** anonymous, ephemeral, lightweight single-page handoff.
- **Full Mode:** authenticated handoff with production knowledge, SEO, WCAG 2.1 AA guidance, security controls and a five-sprint roadmap.
- **Lovable:** the separately installed Lovable plugin performs project creation and subsequent code changes. One Click does not imitate Lovable or use the legacy prompt-fragment URL.

## MCP

Production endpoint: `https://oneclick-chatgpt.woeinvests.workers.dev/mcp`

Tools:

- `oneclick_prepare_basic_draft`
- `oneclick_prepare_full_handoff`
- `oneclick_list_projects`
- `oneclick_get_project`
- `oneclick_get_knowledge_base`
- `oneclick_record_lovable_handoff`

Full Mode uses the existing One Click Supabase identity through an OAuth bearer token. Configure `ONECLICK_SUPABASE_URL` and `ONECLICK_SUPABASE_PUBLISHABLE_KEY` as Worker secrets or deployment configuration. Never commit them.

## Development

```sh
npm run check
npm run deploy:dry
npm run deploy
npm run smoke:production
```

Analytics Engine records coarse invocation telemetry only. It deliberately excludes prompts, business names, URLs, project IDs, tokens, IPs, raw headers and stable user identifiers.
