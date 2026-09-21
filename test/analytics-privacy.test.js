import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { record } from "../src/analytics.js";
import { fetchHandler, rpc } from "../src/worker.js";
import { VERSION } from "../src/version.js";

const TOOL = "oneclick_prepare_basic_draft";
const MARKER = "synthetic_private_marker_9f3a";
const ARGS = { industry: "Pet grooming", primary_goal: "Book appointments" };

function capture(binding) {
  const events = [];
  const pending = [];
  return {
    events,
    env: { ONECLICK_ANALYTICS: binding || { writeDataPoint(point) { events.push(point); } } },
    ctx: { waitUntil(work) { pending.push(work); } },
    async flush() { await Promise.all(pending); }
  };
}

async function call(params, headers = {}, telemetry = capture()) {
  const response = await fetchHandler(new Request("https://plugin.example/mcp", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/call", params })
  }), telemetry.env, telemetry.ctx);
  const body = await response.json();
  await telemetry.flush();
  return { response, body, events: telemetry.events };
}

test("Unrecognised tool and outcome labels cannot carry user data into analytics", async () => {
  const telemetry = capture();
  let coerced = false;
  record(telemetry.env, telemetry.ctx, new Request(`https://plugin.example/mcp?private=${MARKER}`, {
    headers: { "user-agent": `${MARKER} ChatGPT`, origin: `https://${MARKER}.example`, authorization: `Bearer ${MARKER}` }
  }), {
    tool: MARKER,
    outcome: MARKER,
    latencyMs: { toString() { coerced = true; return MARKER; } },
    status: MARKER,
    brief: MARKER,
    id: MARKER
  });
  await telemetry.flush();
  assert.equal(coerced, false);
  assert.deepEqual(telemetry.events, [{
    indexes: ["unknown_tool"],
    blobs: ["tool_call", "unknown_tool", "unknown", "chatgpt", VERSION],
    doubles: [0, 0]
  }]);
  assert.equal(JSON.stringify(telemetry.events).includes(MARKER), false);
});

test("Analytics numerical fields are finite and bounded without string coercion", async () => {
  const cases = [
    { latencyMs: Infinity, status: "200", expected: [0, 0] },
    { latencyMs: -20, status: 99, expected: [0, 0] },
    { latencyMs: 500_000, status: 600, expected: [300_000, 0] },
    { latencyMs: 12.6, status: 200.5, expected: [13, 0] },
    { latencyMs: 12.4, status: 200, expected: [12, 200] }
  ];
  for (const { latencyMs, status, expected } of cases) {
    const telemetry = capture();
    record(telemetry.env, telemetry.ctx, new Request("https://plugin.example/mcp"), { tool: TOOL, outcome: "success", latencyMs, status });
    await telemetry.flush();
    assert.deepEqual(telemetry.events[0].doubles, expected);
  }
});

test("Unknown tool names and unexpected field names never appear in errors or analytics", async () => {
  const unknown = await call({ name: MARKER, arguments: ARGS });
  assert.equal(unknown.body.result.isError, true);
  assert.match(unknown.body.result.content[0].text, /tool_not_found/);
  assert.deepEqual(unknown.events[0].indexes, ["unknown_tool"]);
  assert.equal(JSON.stringify([unknown.body, unknown.events]).includes(MARKER), false);

  const unexpected = await call({ name: TOOL, arguments: { ...ARGS, [MARKER]: MARKER } });
  assert.equal(unexpected.body.result.isError, true);
  assert.match(unexpected.body.result.content[0].text, /invalid_input:unexpected_field$/);
  assert.equal(JSON.stringify([unexpected.body, unexpected.events]).includes(MARKER), false);
});

test("Unexpected exceptions become generic errors and never reach application logs", async (t) => {
  const logs = ["log", "info", "warn", "error", "debug"].map((method) => t.mock.method(console, method, () => {}));
  for (const thrown of [new Error(MARKER), MARKER, { privateDetails: MARKER }]) {
    const args = { ...ARGS };
    Object.defineProperty(args, "industry", { enumerable: true, get() { throw thrown; } });
    const telemetry = capture();
    const body = await rpc({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name: TOOL, arguments: args } }, new Request("https://plugin.example/mcp"), telemetry.env, telemetry.ctx);
    await telemetry.flush();
    assert.equal(body.result.isError, true);
    assert.match(body.result.content[0].text, /internal_error$/);
    assert.equal(JSON.stringify([body, telemetry.events]).includes(MARKER), false);
    assert.equal(telemetry.events[0].blobs[2], "error");
  }
  for (const log of logs) assert.equal(log.mock.callCount(), 0);
});

test("Analytics binding failures cannot leak details or break a successful handoff", async (t) => {
  const logs = ["log", "info", "warn", "error", "debug"].map((method) => t.mock.method(console, method, () => {}));
  const bindings = [
    { writeDataPoint() { throw new Error(MARKER); } },
    { async writeDataPoint() { throw new Error(MARKER); } },
    { get writeDataPoint() { throw new Error(MARKER); } }
  ];
  for (const binding of bindings) {
    const result = await call({ name: TOOL, arguments: ARGS }, {}, capture(binding));
    assert.equal(result.response.status, 200);
    assert.equal(result.body.result.structuredContent.tier, "basic");
    assert.equal(JSON.stringify(result.body).includes(MARKER), false);
  }
  for (const log of logs) assert.equal(log.mock.callCount(), 0);
});

test("Direct MCP clients can suppress operational analytics with DNT or GPC", async () => {
  const baseline = await call({ name: TOOL, arguments: ARGS });
  assert.equal(baseline.events.length, 1);
  for (const headers of [{ DNT: "1" }, { "Sec-GPC": "1" }]) {
    const optedOut = await call({ name: TOOL, arguments: ARGS }, headers);
    assert.deepEqual(optedOut.body, baseline.body);
    assert.equal(optedOut.events.length, 0);
    assert.equal(optedOut.response.headers.get("set-cookie"), null);
    const invalid = await call({ name: MARKER, arguments: ARGS }, headers);
    assert.equal(invalid.body.result.isError, true);
    assert.equal(invalid.events.length, 0);
  }
  const enabled = await call({ name: TOOL, arguments: ARGS }, { DNT: "0", "Sec-GPC": "0" });
  assert.equal(enabled.events.length, 1);
});

test("Malformed MCP parameters return a fixed protocol error without reflecting data", async () => {
  for (const params of [null, MARKER, [MARKER]]) {
    const result = await call(params);
    assert.deepEqual(result.body.error, { code: -32602, message: "Invalid params" });
    assert.equal(result.events.length, 0);
    assert.equal(JSON.stringify(result.body).includes(MARKER), false);
  }
  const invalidName = await call({ name: { private: MARKER }, arguments: ARGS });
  assert.equal(invalidName.body.error.message, "Tool name required");
  assert.equal(invalidName.events.length, 0);
});

test("Deployment configuration disables automatic stored logs and log export", async () => {
  const config = JSON.parse(await readFile(new URL("../wrangler.jsonc", import.meta.url), "utf8"));
  assert.equal(config.observability.enabled, false);
  assert.equal(config.observability.logs.enabled, false);
  assert.equal(config.observability.logs.invocation_logs, false);
  assert.notEqual(config.observability.traces?.enabled, true);
  assert.equal(config.logpush, false);
  assert.equal(config.tail_consumers?.length || 0, 0);
});
