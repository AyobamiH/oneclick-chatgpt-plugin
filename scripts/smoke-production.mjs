import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { VERSION } from "../src/version.js";
import { BASIC_INPUT_SCHEMA } from "../src/tools.js";
import { SUPPORT_EMAIL, PRIVACY_EFFECTIVE_DATE } from "../src/pages.js";

const base = process.env.ONECLICK_PRODUCTION_URL || "https://oneclick-chatgpt.woeinvests.workers.dev";
const evidence = { observedAt: new Date().toISOString(), base, expectedVersion: VERSION, kind: "HTTP and MCP protocol verification; not a ChatGPT UI recording or review approval", pages: [], checks: [] };
async function request(path, init = {}) {
  const response = await fetch(`${base}${path}`, { ...init, signal: AbortSignal.timeout(30_000) });
  assert.equal(response.status, 200, `Unexpected HTTP status for ${path}`);
  assert.equal(response.headers.get("set-cookie"), null, `Unexpected cookie on ${path}`);
  return response;
}
async function rpc(method, params = {}, headers = {}) {
  const response = await request("/mcp", {
    method: "POST", headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params })
  });
  assert.equal(response.headers.get("cache-control"), "no-store");
  return response.json();
}

for (const path of ["/", "/privacy", "/terms", "/support"]) {
  const response = await request(path);
  assert.match(response.headers.get("content-type"), /text\/html/);
  const html = await response.text();
  assert.doesNotMatch(html, /<script\b/i);
  assert.ok(html.includes("/privacy") && html.includes("/support"), `Missing information links on ${path}`);
  if (path === "/privacy") {
    assert.ok(html.includes(`release ${VERSION}`), "Privacy policy is from an unexpected release");
    assert.ok(html.includes(PRIVACY_EFFECTIVE_DATE), "Privacy effective date is stale");
    for (const id of ["data", "recipients", "retention", "controls", "requests"]) assert.ok(html.includes(`id="${id}"`), `Missing privacy section ${id}`);
    for (const key of Object.keys(BASIC_INPUT_SCHEMA.properties)) assert.ok(html.includes(`<code>${key}</code>`), `Undisclosed tool field ${key}`);
    for (const text of ["three months", "seven days", "90 days", "DNT: 1", "Sec-GPC: 1", "Cloudflare", "OpenAI", "Lovable"]) assert.ok(html.includes(text), `Missing privacy disclosure ${text}`);
  }
  if (path === "/privacy" || path === "/support") assert.ok(html.includes(`mailto:${SUPPORT_EMAIL}?subject=One%20Click%20privacy%20request`), `Missing private contact on ${path}`);
  evidence.pages.push({ path, status: response.status, sha256: createHash("sha256").update(html).digest("hex") });
}

const health = await (await request("/health")).json();
assert.equal(health.status, "ok");
assert.equal(health.version, VERSION, "The intended release is not deployed");
assert.equal(health.tools, 1);
assert.equal(health.mode, "anonymous_basic");
assert.equal(health.analytics, "configured");
evidence.health = health;

const init = await rpc("initialize");
assert.equal(init.result.serverInfo.version, VERSION);
assert.match(init.result.instructions, /Do not send unrelated conversation history/i);
const listed = await rpc("tools/list");
assert.equal(listed.result.tools.length, 1);
const tool = listed.result.tools[0];
assert.equal(tool.name, "oneclick_prepare_basic_draft");
assert.deepEqual(tool.annotations, { readOnlyHint: false, destructiveHint: false, openWorldHint: false });
assert.deepEqual(tool.inputSchema, BASIC_INPUT_SCHEMA);
evidence.checks.push("exact deployed version, single tool, eight-field schema and explicit annotations");

const args = { industry: "Pet grooming", primary_goal: "Book appointments", services: ["Dog grooming"] };
const valid = await rpc("tools/call", { name: tool.name, arguments: args });
assert.ok(!valid.result.isError);
assert.equal(valid.result.structuredContent.projectCreated, false);
assert.equal(valid.result.structuredContent.deployed, false);
assert.match(valid.result.structuredContent.lovable.initial_message, /Dog grooming/);
for (const headers of [{ DNT: "1" }, { "Sec-GPC": "1" }]) {
  const optedOut = await rpc("tools/call", { name: tool.name, arguments: args }, headers);
  assert.deepEqual(optedOut.result, valid.result, "Opt-out must not change the handoff");
}
evidence.checks.push("normal preparation and both privacy headers return the same handoff without project creation");

const marker = "synthetic_private_field_73a";
const invalid = await rpc("tools/call", { name: tool.name, arguments: { ...args, [marker]: "must not pass" } });
assert.equal(invalid.result.isError, true);
assert.match(invalid.result.content[0].text, /invalid_input:unexpected_field/);
assert.ok(!JSON.stringify(invalid).includes(marker));
const unknown = await rpc("tools/call", { name: marker, arguments: {} });
assert.equal(unknown.result.isError, true);
assert.ok(!JSON.stringify(unknown).includes(marker));
const malformed = await rpc("tools/call", null);
assert.equal(malformed.error.code, -32602);
evidence.checks.push("unexpected field and tool labels are not reflected; malformed params fail safely");
evidence.limitations = ["Analytics payload omission and opt-out write suppression are exercised by unit tests; this HTTP check does not query stored events.", "Live Cloudflare logging/export settings are verified separately by verify-production-privacy.mjs.", "Support mailbox deletion is an operator process, not a Worker automation."];

if (process.env.ONECLICK_EVIDENCE_PATH) {
  await mkdir(dirname(process.env.ONECLICK_EVIDENCE_PATH), { recursive: true });
  await writeFile(process.env.ONECLICK_EVIDENCE_PATH, `${JSON.stringify(evidence, null, 2)}\n`);
}
console.log(`Production smoke passed: ${base} version=${health.version}; policy/support, contract and privacy error paths verified.`);
