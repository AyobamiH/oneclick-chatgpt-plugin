# One Click 1.0.3: owned-domain information links

This candidate updates the plugin's homepage, website, privacy, terms and support URLs to dedicated pages on `oneclickwebsitedesignfactory.com`. Worker information-page navigation points to the same pages; its original `/privacy`, `/terms` and `/support` remain available for existing clients. The original main website legal pages are separate and are not replaced.

The website introduction shows a real output shape generated with fictional inputs, one link to the published ChatGPT listing and an example starting prompt. It offers optional consent-gated website analytics; its separate disclosure explains those events. The three website plugin legal/support pages load no Google Analytics tag. Website clicks are not installations and are not joined to anonymous MCP events.

The MCP endpoint, required industry/goal fields, six optional fields, tool annotations, brief generation, ephemeral Basic Mode and separate authorised Lovable handoff are unchanged. The handoff schema retains `schemaVersion: 1.0.1`; the candidate package, manifest and server release are `1.0.3`.

## Verification and publication

1. Confirm the checked main-branch Cloudflare Pages build serves all four pages and retains the complete approved service-policy disclosure, support contact and category-specific retention. The website privacy page distinguishes the original 21 September service-policy date from the 8 October website-analytics addition.
2. Run `npm run check` before every push. After merge the existing Deploy workflow deploys the information-path Worker, reads back its live privacy settings and verifies every owned-domain page and asset before updating the MCP Worker. The MCP deployment then checks its own live privacy settings and HTTP/tool behaviour. Require all results before claiming custom-domain pages or runtime 1.0.3 are live.
3. Start with the actual published 1.0.2 release ZIP downloaded from the existing publisher entry. It contains `.codex-plugin/plugin.json` and `skills/build-with-one-click/SKILL.md`; its configured MCP and app icon are managed by the legacy app association, and the publisher shows the MCP key as not specified. Preserve both files, the package identity `app-698c5319a3c8819180537c0c37cde979`, publisher identity, descriptions, empty capabilities and the three existing starter prompts. Change only the version and four public information URLs. Keep the skill bytes identical. Do not add a second MCP declaration or replace the existing configured app. Exclude credentials, repository metadata, build output, historical receipts and unrelated files.
4. Use the existing One Click publisher entry to upload the candidate ZIP and confirm the new metadata URLs. Preserve the published 1.0.2 listing while the candidate is reviewed. Review submission and later publication are separate from a GitHub merge or Worker deployment; neither is established by this document.

Suggested release note: One Click 1.0.3 moves its public information links to dedicated plugin pages on the main One Click website, while retaining the original website policies and the existing MCP/tool behaviour. The introduction now includes a reviewable example and a direct ChatGPT listing link.

## Owned-domain delivery

On 8 October the main domain still served an older website asset while the checked main-branch Cloudflare Pages build served all four new pages. `oneclick-plugin-pages` is a separate, read-only Worker route for `/chatgpt/*` and the bare `/chatgpt` path. It retrieves only eight fixed public HTML/CSS/module files from the stable Pages origin, with no visitor query strings, cookies, authorisation, referrers or bodies forwarded by application code. Unknown paths and non-read methods are rejected. It has no analytics binding, persistence, stored request logs or exports. The public introduction's optional consent-gated analytics runs in the browser on the owned domain.

The existing deployment credentials must have zone Workers Routes permissions and the hostname must be proxied through Cloudflare. The deployment adds these limited routes and verifies their live privacy settings before deploying the MCP Worker. A successful Pages preview does not establish this route or custom-domain delivery: require the actual owned-domain checks. The main website, its original legal pages, account routes and DNS target are outside this routing pattern. Future main-branch Pages updates keep supplying the fixed public files through the stable origin. The fixed plugin-only `/chatgpt/sitemap.xml` lists the four owned-domain pages for separate Search Console submission, leaving the current main sitemap available.


## Cloudflare delivery while the owned domain is unavailable — 9 October 2026

The original website repository now builds and deploys a separate four-page information site at `https://oneclick-chatgpt.pages.dev/chatgpt/` (website PR 16, accepted source `e009771e2dcf15fe636e7cd01a5e7fd86760fcd5`). This does not update the ChatGPT listing or the published MCP runtime. The main-domain metadata remains a future candidate until its URLs serve the correct pages.

The website introduction now imports `analytics-config.mjs`, which allowlists the stable Cloudflare host and the owned domain. The information gateway includes this exact public module in its fixed asset list and production smoke checks. No directory forwarding or wildcard asset access was added. Its upstream remains the original website Pages project, whose main build keeps owned-domain canonicals. The separate launch project uses its own correct canonicals and original-website legal links.
