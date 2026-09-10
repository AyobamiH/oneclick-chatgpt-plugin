# One Click 1.0.1 publisher preparation — 10 September 2026

## Verified implementation

Production source: `dc280d16a1cbc9f11339ab390c6335af91fe4a8f`.
PR #1 merged on 8 September 2026. Deploy run 34285718377 and its production smoke step passed.
Fresh source scan, all 9 unit tests, manifest validation and production smoke passed on 10 September.

The accompanying `evidence/oneclick-1.0.1-live-review.json` records actual responses from the deployed service using synthetic business data. The supporting `assets/oneclick-1.0.1-protocol-demo.mp4` presents those protocol results. It is explicitly labelled as a protocol demonstration, not a ChatGPT Developer Mode recording. The older demo includes a superseded read-only claim and must not be used for the 1.0.1 submission.

## Publisher draft

The previous dashboard showed only rejected version 1.0.0, with its old `readOnlyHint: true` snapshot. No 1.0.1 resubmission was present.

Prepared the 1.0.1 draft with:

- functional subtitle and description matching preparation-only Basic Mode;
- verified developer identity AYOBAMI JOHN HAASTRUP;
- fresh tools scan showing exactly one tool and annotations false / false / false;
- updated annotation justifications describing the append-only operational analytics event;
- the source-controlled 1.0.1 skill uploaded in place of the old attachment; scan Passed;
- five positive test scenarios aligned with current fields and behaviour;
- three negative invocation scenarios retained (generic coding help, purchases, existing-project modification);
- updated release notes.

## Remaining gates

Not submitted at this checkpoint. Do not interpret a saved draft, passing skill scan or deployed Worker as submission or approval.

Automatic approval review rejected creating a private ChatGPT connection named `One Click Review 1.0.1` to the existing unauthenticated MCP endpoint because the resubmission instruction did not explicitly authorise creating an additional persistent app. Do not retry that action without specific user approval. A real Developer Mode demonstration remains pending that connection.

The final publisher form also contains legal and compliance declarations. Request specific confirmation for submitting those declarations with the final review submission, under the Browser skill's action-time legal-agreement rule.

After approval: create the private demo connection, record a real preparation-only interaction using synthetic data, replace the draft demo URL with the verified recording, review the saved draft, submit for review, and verify the resulting Review status. Update this record with the actual submission receipt.
