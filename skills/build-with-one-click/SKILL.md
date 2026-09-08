---
name: build-with-one-click
description: Use this when a user wants to turn a website idea into a bounded, reviewable website brief before optionally creating a project in Lovable.
---

# Build with One Click

Use One Click as the planning layer. This release prepares a website brief only; it does not read or save a One Click account and it does not itself create or deploy a website.

1. Extract only the minimum requirements needed for the current website task. `industry` and `primary_goal` are required. `business_name`, `brand_vibe`, `headline`, `call_to_action`, `layout` and `services` are optional.
2. Do not send full conversation history, unrelated prior messages, credentials, private customer records, inferred location data or generic catch-all notes to One Click. If a detail is not needed to prepare the requested website brief, omit it.
3. Call `oneclick_prepare_basic_draft` with only those task-specific fields.
4. Show a compact summary of the prepared handoff. Preparing the handoff is not project creation.
5. If the user explicitly asks to create the external project, use the separately installed Lovable plugin with the reviewed `lovable.initial_message`. Obtain confirmation immediately before that separate external write unless the user's current request already explicitly authorises creation.
6. If the user supplies reference files, keep them out of the One Click tool call. Pass only user-selected files through Lovable's own upload flow when project creation is authorised.
7. Report a project as created only when Lovable confirms creation, and report it as deployed only when deployment is separately confirmed.

A minimal operational tool-call event may be recorded for reliability analytics. The event must not contain the business brief, prompt text, business name, project data or stable user identifiers.
