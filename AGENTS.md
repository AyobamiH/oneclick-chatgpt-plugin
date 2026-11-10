# One Click ChatGPT Plugin

- This repository is the independent ChatGPT/Codex plugin for One Click.
- Do not modify or copy secrets from `oneclickwebdesignfactory`.
- Keep Basic Mode anonymous and ephemeral.
- Keep saved projects and Full Mode behind the existing One Click user identity.
- The One Click MCP prepares a structured handoff. ChatGPT invokes the separately installed Lovable plugin.
- Run `npm run check` before every push and smoke-test `/health`, `/mcp`, `/privacy`, `/terms`, and `/support` after deployment.


## Repository-owned agent foundations

Start with [project knowledge](.agents/knowledge/README.md) and the [Secure API Delivery skill](.agents/skills/secure-api-delivery/SKILL.md). Open these files directly if your agent does not discover checkout skills automatically. They are versioned here and require no personal skill installation. Preserve all existing project-specific instructions and deeper directory rules.

For every development task, apply the skill scope/evidence review before editing. For documentation-only work, record why API/runtime checks are not applicable; never equate documentation checks with production security. The skill does not authorise live scans, credentials, publishing or deployment.

Update the relevant knowledge in the same change when architecture, behavior, commands or boundaries change. Keep verified rationale and lessons with source links; do not store raw chats, secrets or unverified live status. Existing release, ownership and approval gates remain in force.

Requires Python 3.9 or newer. Run `python3 .agents/check-foundations.py` for the required skill files, AGENTS/README discovery pointers and Markdown links in those files and the knowledge entry point. This lightweight check is not a CI gate or an application/security test.
Run `python3 .agents/test-foundations.py` for isolated negative discovery fixtures.
