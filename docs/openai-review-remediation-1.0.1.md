# OpenAI review remediation — One Click 1.0.1

This release addresses the two rejection categories reported for One Click 1.0.0: tool annotations that did not match actual behaviour, and overly broad/unnecessary tool inputs.

## Exposed tool

`oneclick_prepare_basic_draft`

The release intentionally exposes one preparation-only tool. Authenticated saved-project tools and Full Mode are not part of this release.

## Annotation justifications

- `readOnlyHint: false` — each tool invocation may append a minimal operational event to the configured Analytics Engine dataset. The application-level event contains tool name, success/error, rounded latency, release version and coarse client family. It does not contain the business brief or prompt text.
- `destructiveHint: false` — the tool does not delete, overwrite, revoke, publish, deploy or mutate customer project state.
- `openWorldHint: false` — the tool operates only on supplied bounded arguments and does not browse arbitrary URLs, fetch external resources or call Lovable.

All three hints are explicit booleans in the live tool definition.

## Narrow input contract

Required:

- `industry`
- `primary_goal`

Optional and task-specific:

- `business_name`
- `brand_vibe`
- `headline`
- `call_to_action`
- `layout` from a fixed enum
- `services` as a bounded string array

The tool does not accept `location`, `additional_notes`, `reference_image_urls`, account credentials, full conversation history or arbitrary additional properties. Runtime validation rejects unexpected keys, wrong types, unsupported layouts, excess list items and oversized MCP request bodies.

## Reviewer test cases

### Positive 1 — minimal brief

Input: `industry=Pet grooming`, `primary_goal=Book appointments`.

Expected: a Basic Mode handoff is returned with `projectCreated=false` and `deployed=false`; no account access or external project creation occurs.

### Positive 2 — optional brand direction

Add `business_name=Northampton Paws`, `brand_vibe=Friendly and trustworthy`.

Expected: supplied values appear in the handoff; missing business facts remain placeholders and are not fabricated.

### Positive 3 — services are relevant and used

Add `services=[Dog grooming, Nail trims]`.

Expected: both services appear in `lovable.initial_message`.

### Positive 4 — fixed layout

Set `layout=local-service`.

Expected: the selected supported layout appears in the handoff.

### Positive 5 — separate authorised project creation

After reviewing the handoff, explicitly authorise the separately installed Lovable plugin to create a test project.

Expected: One Click itself still performs no external creation; Lovable owns the separate write. Do not report deployment unless Lovable separately confirms deployment.

### Negative 1 — conversation history

Add `conversation_history=SYNTHETIC_PRIVATE_MARKER`.

Expected: One Click rejects the request as an unexpected field. The marker does not appear in application analytics.

### Negative 2 — invalid shape

Set `industry` to an object or `services` to a string.

Expected: validation error; no project creation occurs.

### Negative 3 — prepare-only request

User says: “Prepare the website brief only. Do not create anything.”

Expected: the preparation tool returns a handoff; no Lovable action, upload, publication or deployment occurs.

## Production verification

The deployment workflow runs source scanning, unit tests and manifest validation before deploying. The post-deploy smoke test verifies:

- health and legal/support pages return 200;
- MCP instructions warn against unrelated conversation history;
- exactly one tool is exposed;
- annotation values are exactly `false / false / false`;
- removed broad fields are absent from the schema;
- a valid preparation request succeeds;
- an unexpected conversation-history field is rejected.

For resubmission, deploy this exact release first, then use **Scan Tools** in the OpenAI publisher flow so the saved review snapshot reflects the live 1.0.1 tool catalogue and annotations.