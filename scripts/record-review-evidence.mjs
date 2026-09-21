import { VERSION } from "../src/version.js";

// Evidence always checks the current source release and never overwrites a
// historic 1.0.1 receipt while presenting it as a newer release.
process.env.ONECLICK_EVIDENCE_PATH ||= `artifacts/oneclick-${VERSION}-live-review.json`;
await import("./smoke-production.mjs");
console.log(`Recorded current-release protocol evidence: ${process.env.ONECLICK_EVIDENCE_PATH}`);
