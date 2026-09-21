# One Click privacy operations

Effective 21 September 2026 for release 1.0.2. Owner: AYOBAMI JOHN HAASTRUP.

This procedure implements the public policy. It is an operator workflow; the Worker does not read the support mailbox or automate email deletion.

## Private contact

Use `john@tailwaggingwebdesign.com`, the business contact explicitly selected by the owner on 21 September 2026 for One Click support and privacy requests. No test email was sent and mailbox delivery is not asserted by HTTP tests.

The plugin's `/support` and `/privacy` pages link directly to that mailbox using the subject `One Click privacy request`. General support uses `One Click plugin support`. Do not redirect privacy requests to public GitHub issues.

## Handling a request

1. Classify the message as a One Click plugin support/privacy request and record receipt date in the private case record. Never copy private case details into this repository or an issue.
2. Ask only for the minimum information needed to locate the relevant correspondence. Verify the requester proportionately before disclosing someone else's data; do not request identity documents by default.
3. Identify the requested outcome: access, correction, deletion, restriction, objection or explanation. Track any applicable statutory deadline from receipt. If a deadline extension or exemption applies, explain it to the requester rather than silently deferring.
4. Explain that the preparation service has no saved brief/account history. Do not promise retrieval or deletion of data it never stored. For ChatGPT/client or Lovable copies, direct the requester to the provider's account controls.
5. Analytics have no stable user identity. Do not reconstruct an individual's history or collect more identity information to join events. Handle any concrete concern about personal data in historical records privately and minimise inspection.
6. Record the result, the closure date and a deletion deadline exactly 90 calendar days after closure in the private case record. Avoid retaining the original problem details in a second tracking system.

## Support correspondence deletion

At least weekly, the owner checks closed One Click plugin cases. Delete any case whose 90-day deadline falls before the next weekly check, so deletion occurs within the stated maximum rather than after it.

Deletion covers the received message, replies/sent copies, attachments, archived copies, forwarded working copies controlled by the operator, and any separate case notes no longer needed. Remove these from Trash as well where the mailbox offers permanent deletion. Archiving is not deletion. Do not delete unrelated business mail under this procedure.

If a specific legal duty or unresolved dispute requires a hold, record only the necessary scope, reason, review date and end condition in the private record. Explain the retention reason to the requester when applicable. Review the hold at least monthly and delete the held material once its reason ends. A general preference to keep old mail is not a retention exception.

Provider-managed residual backups are governed by the email provider; do not claim immediate erasure of backups outside operator control. Confirm the active mailbox outcome to the requester without inventing a provider deletion receipt.

## Runtime and analytics retention

- Briefs and prompts: request memory only; no application persistence, account database, history or backups.
- Analytics Engine: fixed operational categories and bounded numeric values; documented retention **three months**, not an exact 90-day promise. No analytics export is configured by this release.
- Before 1.0.2, an unknown tool name could pass the old character filter. The fix prevents new occurrences; it does not erase historical events. If historical auditing is needed, start with a count of nonstandard labels, without selecting the labels themselves. A positive count is not proof of personal data.
- Stored Worker logs/invocation logs/Logpush: disabled. Older logs expire under Cloudflare's plan retention, at most seven days from collection. Do not assert retroactive deletion merely because collection was disabled.
- DNT:1 or Sec-GPC:1 suppresses the custom Analytics Engine event for that request. It does not suppress Cloudflare's essential network processing or control another provider's data practices.
- Do not enable tracing, a Tail Worker, Logpush, log destinations, persistent project storage or a new analytics exporter without reviewing the policy and retention consequences.

## Release verification

Run `npm run check` and `npm run deploy:dry` before release. The protected deployment workflow uses the existing Cloudflare credentials, verifies the deployed policy/tool version, and reads the actual Worker settings. A successful local config check alone does not establish production settings.

Do not claim privacy-policy publication or remediation is live until the deployment and post-deploy checks succeed. Keep review submission separate: a deployed 1.0.2 is not an OpenAI submission, approval or publication.

## Sources

- [OpenAI plugin privacy requirements](https://developers.openai.com/plugins/app-guidelines#privacy)
- [Cloudflare Analytics Engine retention](https://developers.cloudflare.com/analytics/analytics-engine/limits/#data-retention)
- [Cloudflare Analytics Engine timestamps](https://developers.cloudflare.com/analytics/analytics-engine/get-started/#working-with-time-series-data)
- [Workers Logs retention](https://developers.cloudflare.com/workers/observability/logs/workers-logs/)
- [ICO privacy-information guidance](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/individual-rights/the-right-to-be-informed/what-privacy-information-should-we-provide/)
