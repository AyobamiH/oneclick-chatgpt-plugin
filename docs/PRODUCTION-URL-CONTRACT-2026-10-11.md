# Canonical production URL contract — 11 October 2026

The web product stays at https://oneclickwebsitedesignfactory.com/ and /dashboard. Cookie authentication, signed ChatGPT consent, verification/reset callbacks and payment returns stay on that origin. The native MCP service uses https://mcp.oneclickwebsitedesignfactory.com/mcp; its OAuth issuer is https://oneclickwebsitedesignfactory.com/api/auth and its resource audience is the exact MCP URL. There is no separate app or API public hostname.

The web gateway forwards /api, /.well-known and /health to the internal backend service without caching or SPA fallback. The exact /chatgpt/connect application route outranks the existing static /chatgpt/* information route. The www host redirects to the apex with status 308 and preserves the path/query. The apex remains a reversible Worker Route over the preserved provider origin; it must not become a Worker Custom Domain while that origin is the rollback path.

Production config files are preparation templates, not deployment receipts. Backend activation flags remain false and its production D1 placeholder must be replaced only after a separate production database has been provisioned, all additive migrations applied, and the frozen source reconciled. Build the web assets with VITE_BACKEND_PROVIDER=cloudflare. Do not bind the review/staging databases to production.

Live Cloudflare readback at 09:42 UTC confirmed an active zone and matching public nameservers nick.ns.cloudflare.com / ullis.ns.cloudflare.com. The current apex remains a proxied CNAME to websitedesignfactory.lovable.app. IONOS mail records are retained. New canonical MCP binding points to the existing Basic runtime; it does not enable Full Mode.

The candidate's .mcp.json now declares the canonical MCP URL. The published Basic 1.0.3 declaration retains its approved workers.dev endpoint for compatibility. OpenAI's current update flow requires support to change an existing plugin's MCP URL; a ZIP upload does not complete that migration. See https://developers.openai.com/plugins/deploy/submission. Do not remove the old endpoint until OpenAI-assisted migration and install/scan acceptance succeed.

Release still depends on the source MFA administrator recovery, OneClick-owned Google OAuth roundtrip, actual inbox/payment-return acceptance, frozen migration reconciliation, final live payment permissions, production-domain rollback, remaining actual native UI acceptance, and publisher approval. No template or unit test waives these gates.

Validation of this patch: 39 backend tests, 8 gateway/URL contract tests, 60 native checks, a Cloudflare-provider website build and generated service-worker routing checks pass. The canonical Basic alias passed HTTP/MCP/policy/support smoke. This remains preparation plus Basic-domain publication, not completed Full Mode release.
