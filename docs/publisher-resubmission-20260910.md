# One Click 1.0.1 submitted for review — 10 September 2026

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

## Authorised ChatGPT demonstration

The user explicitly approved the private demo connection, synthetic-data recording, and final submission with the displayed terms and declarations on 10 September 2026.

Created and connected `One Click Review 1.0.1` to the existing unauthenticated production endpoint. In a real ChatGPT conversation, a fictional Northampton Paws request triggered `oneclick_prepare_basic_draft`. The visible permission details contained only the six supplied website fields. The single tool call was allowed once; broad persistent tool permissions were not enabled.

The actual response reported `schemaVersion: 1.0.1`, `tier: basic`, `projectCreated: false`, and `deployed: false`. The returned handoff included the synthetic business, services, goal, brand and layout. No Lovable creation or deployment was performed.

`assets/oneclick-1.0.1-chatgpt-demo.mp4` is a 32-second sequence of actual ChatGPT Developer Mode screen captures. It presents the request, permission details, completed answer and actual tool response; pauses are condensed and labelled. The account sidebar is excluded. `evidence/oneclick-1.0.1-chatgpt-transcript.txt` preserves the visible synthetic interaction.

## Confirmed submission receipt

Submitted One Click version **1.0.1** for review on 10 September 2026. The publisher displayed **One Click submitted for review**, followed by the dashboard row **1.0.1 — Review**. This confirms submission, not approval or publication.

- Dashboard: https://platform.openai.com/plugins
- Publisher app: `asdk_app_698c5319a3c8819180537c0c37cde979`
- Publisher version: `asdk_app_v_698c531aa1a481918c7e92123d7afbf8`
- Submitted demo: https://raw.githubusercontent.com/AyobamiH/oneclick-chatgpt-plugin/34eb3d99c4b1e6931e16f74fbc2c9c4623d9af5e/assets/oneclick-1.0.1-chatgpt-demo.mp4
- Receipt image: `evidence/oneclick-1.0.1-submission-receipt.jpg`
- Latest asset commit CI: https://github.com/AyobamiH/oneclick-chatgpt-plugin/actions/runs/34485404869 — success.
- Latest deployment: https://github.com/AyobamiH/oneclick-chatgpt-plugin/actions/runs/34485404813 — success.

The earlier automatic approval block for creating the private connection was resolved by the user's explicit approval. The real ChatGPT demonstration is complete.

The user explicitly confirmed submission with the displayed legal and compliance declarations; those declarations were submitted with this version.

Next external gate: OpenAI's review decision. Do not resubmit this version again merely because repository code or deployment is inspected. Read the current dashboard decision before taking the next distribution action. No monitoring automation was created in this session.
