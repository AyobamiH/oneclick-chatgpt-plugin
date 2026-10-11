# Actual native host acceptance, 11 October 2026

The private ChatGPT review installation connected through the deployed backend
`32286a80dd8afb698c5bb6c65d203887cba2cfd3` and native parent revision
`5b238ea97b1e95c88601d75163e8da474469f428`. The signed-in consent page and
ChatGPT workspace's authenticated Full Mode access read succeeded.

The first native trial write failed with a generic host-facing message.
Read-only inspection of the disposable account showed one unrevoked OAuth
grant, no trial row, no trial-start rate-limit row, no paid access and zero
support tickets. Therefore it did not start the trial or charge the account.

ChatGPT's installation settings reported that app-only write helpers advertised
widgets that private tools cannot render. This patch removes resourceUri from
app-only helpers while retaining app visibility, OAuth requirements and write
annotations. Entrypoint openers retain their UI resource: OpenAI's entrypoint
specification explicitly ignores visibility when opening an entrypoint.
The UI now shows bounded text-only MCP errors instead of losing the host's
explanation. The concrete native trial failure's root cause remains unproven
until the refreshed installation is exercised.

References:
- https://github.com/openai/mcp-extensions/blob/main/docs/spec.md
- https://github.com/modelcontextprotocol/ext-apps/blob/c55a3a231fb76303376e059aef9a13367e72731c/specification/draft/apps.mdx

Validation: npm run check passed all 58 checks after the patch. The focused
coverage checks the actual listed writer metadata and a text-only host denial
followed by a retry without starting or charging during the denial.
No app permission settings, production services or Basic 1.0.3 were changed.
Full integration acceptance, migration PR #17, payment-return and publisher
release gates remain outstanding.
