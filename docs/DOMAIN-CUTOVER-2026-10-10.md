# Domain activation checkpoint — 10 October 2026

## Completed and verified

- IONOS saved `nick.ns.cloudflare.com` and `ullis.ns.cloudflare.com`. Cloudflare reports the intended zone active.
- The 21-record DNS inventory was preserved. Only the apex web record was proxied after Universal SSL became active; its existing origin remains `185.158.133.1`. Mail, TXT and founders records were not edited.
- Gateway revision `2db4938ce526e2a3d5b36d2fc598ed60c9805de9` fixes an actual Workers runtime rejection of `redirect: "error"`. It uses `manual` and still rejects non-200 upstream responses. All 45 checks passed; PR 10 was merged.
- Four plugin HTML pages and four fixed assets pass direct gateway checks at `oneclick-plugin-pages.woeinvests.workers.dev`.
- Production gateway observability, invocation collection, tracing, persistence, export destinations, Logpush and tail consumers are inactive. The temporary fixed-target diagnostic Worker was deleted.

## Unfinished production boundary

The main hostname `/chatgpt/` still renders the previous application's 404 screen. GitHub deployment run 38009388223 correctly failed its owned-domain content check. A deployed gateway or active zone is not owned-domain acceptance.

The legacy site uses an A record to a Cloudflare for SaaS apex proxy. Cloudflare documents that O2O does not apply to this configuration; it requires the provider's CNAME target. Lovable documents a proxy mode using the published project's current `lovable.app` CNAME. The old project URL recorded in repository documentation returns 404 and must not be promoted as the live origin.

The connected provider API identifies the existing project but does not expose domain configuration. Browser domain settings require a separate Lovable sign-in. No provider setting, full website origin, account backend or payment flow was changed to work around this boundary. The concurrent website backend migration branch was not promoted.

- Owned-domain introduction/privacy/terms/support acceptance: pending provider routing configuration.
- Domain Guard restoration: requested by email; activation was pending at the last signed-in IONOS observation.
- Existing publisher entry: still published version 1.0.2; owned-domain metadata/ZIP not submitted.
- Interim host redirects: not applied before owned-domain acceptance.
- GA4 collection and organic acquisition: not established by this checkpoint.

## Continuation

Obtain the existing host's current supported CNAME/proxy configuration with owner access, preserve the original website, and rerun owned-domain content checks plus browser acceptance. Verify original root, auth, privacy and terms. Then update the existing publisher entry with the prepared owned-domain bundle; obtain action-time confirmation for any legally binding submission declarations. Restore Domain Guard through the pending owner email and verify its active state.

References: https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/saas-customers/how-it-works/ and https://docs.lovable.dev/features/custom-domain#advanced-use-a-cdn-or-reverse-proxy.
