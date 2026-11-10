# One Click plugin agent knowledge

## Architecture and entry paths

This repository's main line exposes anonymous Basic Mode. [Worker entry](../../src/worker.js) routes MCP calls to [tools](../../src/tools.js) and [draft construction](../../src/draft.js). [Information-page Worker](../../src/information-pages-worker.js) is a separate surface. [Product skill](../../skills/build-with-one-click/SKILL.md) describes the brief handoff.

## Setup and checks

[Package scripts](../../package.json) declare Node >=20. `npm run check` runs syntax checks, Node tests and plugin validation without a build dependency install. `npm run dev` downloads/runs pinned Wrangler via npx as needed. Deploy, production smoke, privacy verification and evidence collection scripts target external infrastructure and need separate scope.

## State and security boundaries

Basic Mode prepares a bounded brief; it does not create or deploy a website or persist the brief. [Worker instructions](../../src/worker.js) prohibit unrelated conversation history and credentials. [Analytics](../../src/analytics.js) is a minimal operational side effect, not permission to store brief content. Preserve anonymous, ephemeral Basic Mode and explicit approval before an external builder creates anything. Saved projects/Full Mode are not established by the main-line tool catalogue; do not transplant newer branch assumptions or another repository's secrets.

## Decisions and authoritative references

[README capability boundary](../../README.md), [privacy operations](../../docs/privacy-operations.md), [review remediation](../../docs/openai-review-remediation-1.0.2.md), and [owned-domain handoff](../../docs/owned-domain-release-1.0.3.md) explain narrowed inputs, analytics and separate information pages. Historical release claims are not current live proof. [Deployment instructions](../../docs/deployment.md) do not grant deployment authority.
