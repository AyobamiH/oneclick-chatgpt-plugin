# Production deployment

The protected `Deploy` workflow publishes `src/worker.js` to the `oneclick-chatgpt` Cloudflare Worker, checks live privacy settings, and runs HTTP/MCP production verification.

Required existing GitHub Actions secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

The deployment uses pinned Wrangler 4.33.1, matching `npm run deploy:dry`. Basic Mode is anonymous and does not require One Click account or Supabase secrets. Do not copy credentials from the separate One Click website.

The Analytics Engine binding remains enabled for narrowly scoped, three-month operational events. Stored Worker log collection, tracing and Logpush are disabled. The live-settings verifier also rejects enabled collection or export/tail destinations. A missing read permission or an unverified setting fails the deployment check; it does not produce a success claim.

The verifier first reads the Worker's `/script-settings` endpoint. If that successful response omits observability or returns it as null, it reads the [Get Worker metadata endpoint](https://developers.cloudflare.com/api/resources/workers/subresources/beta/subresources/workers/methods/get/) and validates only privacy-related fields, including agreement on Logpush and tail consumers. It never prints or saves the broader response or its other fields. The fallback requires explicit disabled collection settings; it does not treat missing evidence as disabled logging.

Cloudflare can retain `invocation_logs` and `persist` preferences as true while the corresponding log or trace collection is disabled. These dormant preferences do not enable collection. The evidence therefore distinguishes effective disabled collection/persistence from the observed inactive preferences; it does not claim that every nested preference was read back as false. Re-enabling logs or traces would require a new policy and configuration review.

## Verification

```sh
npm run check
npm run deploy:dry
npm run smoke:production
npm run verify:privacy
```

The first two are local checks. The smoke check asserts the deployed release version, complete policy sections and fields, private contact, eight-field tool schema, annotations, normal preparation, privacy-header compatibility, and sanitised error paths. The live privacy settings command needs the existing Cloudflare credentials in the environment; it never prints credential values or the full settings response.

The deploy workflow captures HTTP/MCP evidence and privacy-setting readback as a GitHub Actions artifact. These receipts establish deployment and behaviour only. They do not establish mailbox delivery, completed support deletion, deletion of historical records, a ChatGPT UI demonstration or approval by OpenAI.

## Rollback

Use a reviewed preceding Worker deployment only after considering the privacy consequences. Rolling back to 1.0.1 also restores its limited disclosure and unsafe analytics-label handling; it is not an acceptable resubmission candidate. Prefer a forward fix that preserves the privacy controls. Do not resubmit while a deployment or privacy-settings check is failing.
