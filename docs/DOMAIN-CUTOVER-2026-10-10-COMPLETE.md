# One Click domain and publisher update — 10 October 2026

The existing main website remains on its published Lovable origin. Cloudflare is active for the main domain; its proxied apex CNAME now targets websitedesignfactory.lovable.app. The change preserved all 20 other DNS records. The private DNS backup and rollback receipt remain outside this repository.

All four /chatgpt/ information pages and their assets passed live HTTP acceptance at 01:03 UTC. Original root, privacy, terms and auth routes retain the existing application bundle. The cloud browser still showed the older application 404 on the plugin privacy route; browser-rendered acceptance remains outstanding and is not represented as passed.

Production MCP smoke passed for version 1.0.3. Main deployment run 38010955184 passed after rerun; the first attempt checked a stale privacy release immediately after deployment.

The initial two-file update ZIP was rejected by the publisher because legacy exports omit the externally attached MCP and icon. The corrected complete package declares the single existing endpoint in .mcp.json and includes assets/logo.png. The publisher matched it to existing app asdk_app_698c5319a3c8819180537c0c37cde979; no duplicate app was created. Skill content is unchanged.

Publisher version 1.0.3 is a draft with the four owned-domain links. Final checks, action-time legal declarations, review and publication remain separate gates. Published listing version remains 1.0.2 until approval and publication are verified. Domain Guard reactivation remains pending owner email confirmation.

This checkpoint supersedes the routing-blocked status in the earlier unmerged docs/domain-cutover-20261010 checkpoint. It does not approve the other chat's full website backend migration.
