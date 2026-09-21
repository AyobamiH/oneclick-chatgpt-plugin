import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { checkPrivacySettings, verifyProductionPrivacy, runProductionPrivacyVerification, privacyFailureReport } from "../scripts/verify-production-privacy.mjs";

const SECRET = "synthetic-private-provider-marker";
const ACCOUNT = "a".repeat(32);
const env = { CF_API_TOKEN: SECRET, CF_ACCOUNT_ID: ACCOUNT };
const now = () => new Date("2026-09-21T23:00:00Z");
function safePayload() {
  return { success: true, errors: [], messages: [], result: {
    observability: { enabled: false, logs: { enabled: false, invocation_logs: false }, traces: { enabled: false, persist: false, destinations: [] }, issues: { enabled: false } },
    logpush: false, tail_consumers: []
  } };
}
const response = (payload = safePayload()) => Response.json(payload);

test("Live verification uses a single fixed read-only endpoint and returns only safe fields", async () => {
  const payload = safePayload();
  payload.result.bindings = [{ name: SECRET, text: SECRET }];
  payload.result.tags = [SECRET];
  let calls = 0;
  const result = await verifyProductionPrivacy({ env, now, fetchImpl: async (url, options) => {
    calls++;
    assert.equal(url, `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT}/workers/scripts/oneclick-chatgpt/script-settings`);
    assert.equal(options.method, "GET");
    assert.equal(options.redirect, "error");
    assert.equal(options.headers.Authorization, `Bearer ${SECRET}`);
    return response(payload);
  } });
  assert.equal(calls, 1);
  assert.equal(result.status, "verified");
  assert.equal(result.observed_at, "2026-09-21T23:00:00.000Z");
  assert.equal(Object.values(result.checks).every((value) => typeof value === "boolean"), true);
  assert.equal(JSON.stringify(result).includes(SECRET), false);
  assert.equal(JSON.stringify(result).includes(ACCOUNT), false);
  assert.equal("bindings" in result, false);
});

test("Explicit disabled parent accepts documented absent or null logs/traces overrides", () => {
  for (const overrides of [{}, { logs: null, traces: null }]) {
    const payload = safePayload();
    payload.result.observability = { enabled: false, ...overrides };
    payload.result.tail_consumers = null;
    const result = checkPrivacySettings(payload);
    assert.equal(result.tracing_disabled, true);
    assert.equal(result.logs_configuration_present, false);
    assert.equal(result.traces_configuration_present, false);
  }
});

test("Enabled collection, zero-sampled collection, persistence and exporters fail closed", () => {
  const mutations = [
    (p) => { p.result.observability.enabled = true; },
    (p) => { p.result.observability.logs.enabled = true; p.result.observability.logs.head_sampling_rate = 0; },
    (p) => { p.result.observability.logs.invocation_logs = true; },
    (p) => { p.result.observability.logs.persist = true; },
    (p) => { p.result.observability.logs.destinations = [SECRET]; },
    (p) => { p.result.observability.traces.enabled = true; },
    (p) => { p.result.observability.traces.persist = true; },
    (p) => { p.result.observability.traces.destinations = [SECRET]; },
    (p) => { p.result.observability.issues.enabled = true; },
    (p) => { p.result.logpush = true; },
    (p) => { p.result.tail_consumers = [{ service: SECRET }]; }
  ];
  for (const mutate of mutations) {
    const payload = safePayload(); mutate(payload);
    assert.throws(() => checkPrivacySettings(payload), (error) => {
      const report = privacyFailureReport(error);
      assert.equal(report.status, "failed");
      assert.equal(JSON.stringify(report).includes(SECRET), false);
      return true;
    });
  }
});

test("Missing required evidence, wrong types and unrecognised telemetry settings fail closed", () => {
  const mutations = [
    (p) => { delete p.result.observability; },
    (p) => { delete p.result.observability.enabled; },
    (p) => { p.result.observability.enabled = "false"; },
    (p) => { p.result.observability.logs = []; },
    (p) => { delete p.result.observability.logs.enabled; },
    (p) => { delete p.result.observability.logs.invocation_logs; },
    (p) => { p.result.observability.logs.persist = null; },
    (p) => { p.result.observability.logs.destinations = null; },
    (p) => { p.result.observability.logs.head_sampling_rate = "0"; },
    (p) => { p.result.observability.logs[SECRET] = false; },
    (p) => { p.result.observability.traces = {}; },
    (p) => { p.result.observability.traces.enabled = 0; },
    (p) => { p.result.observability.traces.propagation_policy = SECRET; },
    (p) => { p.result.observability.issues = null; },
    (p) => { p.result.observability[SECRET] = { enabled: true }; },
    (p) => { delete p.result.logpush; },
    (p) => { p.result.logpush = null; },
    (p) => { delete p.result.tail_consumers; },
    (p) => { p.result.tail_consumers = {}; }
  ];
  for (const mutate of mutations) {
    const payload = safePayload(); mutate(payload);
    assert.throws(() => checkPrivacySettings(payload));
  }
  for (const payload of [null, [], {}, { success: true, result: {} }, { success: true, errors: [], result: [] }]) assert.throws(() => checkPrivacySettings(payload));
});

test("Network, HTTP, JSON and unsuccessful API responses cannot become verified evidence", async () => {
  const failures = [
    async () => { throw new Error(SECRET); },
    async () => new Response(SECRET, { status: 403 }),
    async () => new Response(SECRET, { status: 200 }),
    async () => response({ success: false, errors: [{ message: SECRET }], result: safePayload().result }),
    async () => response({ ...safePayload(), errors: [{ message: SECRET }] }),
    async () => ({ ok: true, json: async () => safePayload() })
  ];
  for (const fetchImpl of failures) {
    await assert.rejects(verifyProductionPrivacy({ env, fetchImpl }), (error) => {
      const report = privacyFailureReport(error);
      assert.equal(report.status, "failed");
      assert.equal(JSON.stringify(report).includes(SECRET), false);
      assert.equal(JSON.stringify(report).includes(ACCOUNT), false);
      return true;
    });
  }
});

test("Missing or malformed credentials fail before an outbound request", async () => {
  for (const candidate of [{}, { CF_API_TOKEN: SECRET }, { CF_ACCOUNT_ID: ACCOUNT }, { ...env, CF_ACCOUNT_ID: `${ACCOUNT}/${SECRET}` }, { ...env, CF_API_TOKEN: `x\n${SECRET}` }]) {
    let called = false;
    await assert.rejects(verifyProductionPrivacy({ env: candidate, fetchImpl: async () => { called = true; return response(); } }));
    assert.equal(called, false);
  }
  const result = await verifyProductionPrivacy({ env: { CLOUDFLARE_API_TOKEN: SECRET, CLOUDFLARE_ACCOUNT_ID: ACCOUNT }, fetchImpl: async () => response() });
  assert.equal(result.status, "verified");
});

test("Safe receipts are saved and a subsequent failure replaces stale success", async () => {
  const dir = await mkdtemp(join(tmpdir(), "oneclick-privacy-"));
  try {
    const path = join(dir, "artifacts", "privacy.json");
    const receiptEnv = { ...env, ONECLICK_PRIVACY_EVIDENCE_PATH: path };
    const verified = await runProductionPrivacyVerification({ env: receiptEnv, now, fetchImpl: async () => response() });
    assert.deepEqual(JSON.parse(await readFile(path, "utf8")), verified);
    await assert.rejects(runProductionPrivacyVerification({ env: receiptEnv, fetchImpl: async () => { throw new Error(SECRET); } }));
    const failed = JSON.parse(await readFile(path, "utf8"));
    assert.equal(failed.status, "failed");
    assert.equal(JSON.stringify(failed).includes(SECRET), false);
    const blocker = join(dir, "file");
    await writeFile(blocker, "not a directory");
    await assert.rejects(runProductionPrivacyVerification({ env: { ...env, ONECLICK_PRIVACY_EVIDENCE_PATH: join(blocker, "receipt.json") }, fetchImpl: async () => response() }), /privacy_evidence_write_failed/);
  } finally { await rm(dir, { recursive: true, force: true }); }
});
