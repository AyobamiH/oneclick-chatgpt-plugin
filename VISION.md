---
schema: clawsweeper.project-vision.v1
project_id: oneclick-chatgpt-plugin
repository: AyobamiH/oneclick-chatgpt-plugin
---

# Project Vision

## Identity

One Click for ChatGPT is an independent conversational plugin that converts a small, bounded website brief into a structured handoff for a separately installed website-building tool.

## Purpose

Let a user describe a basic website outcome in a narrow schema and receive a safe, ephemeral handoff without turning this plugin into the website builder, deployment system, or saved-project backend.

## Owns

- The Basic Mode brief schema and validation.
- The hosted MCP/tool surface that prepares the handoff.
- Privacy-safe operational analytics for the plugin invocation.
- Public privacy, terms, support, and review-facing plugin behaviour.

## Does Not Own

- Website creation, publication, or deployment.
- The external Lovable write path.
- Saved projects or authenticated Full Mode until those surfaces are independently approved.
- OneClickPostFactory's social-publishing product.

## Non-Negotiable Invariants

- Basic Mode stays anonymous and ephemeral.
- The tool accepts only bounded website fields, not conversation dumps or generic catch-all input.
- The handoff does not imply that an external project was created.
- External creation occurs only through a separately installed/authorised tool.
- Analytics exclude prompt content, business brief content, names, URLs, tokens, raw headers, and stable user identifiers.
- Deployment and marketplace/review approval are separate states.

## Evidence of Done

A plugin change is done when the exact tool schema, annotations, privacy behaviour, rejection paths, and hosted surface are verified. A prepared brief is not evidence of website creation.

## Relationships

- One Click website/product: separate product and identity surface.
- Lovable: separate external creation path used only after user authorisation.

## Canonical Sources

README.md, AGENTS.md, docs/privacy-operations.md, and the current review-remediation evidence.

## Agent Rule

Keep this plugin a bounded handoff surface. Do not smuggle creation, persistence, or broad context collection into a tool whose contract is preparation only.
