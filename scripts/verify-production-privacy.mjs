import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

// Prefer the narrow script-level endpoint. It can return null observability for
// a disabled Worker. Only that evidence gap triggers the newer Get Worker API,
// which must return explicit disabled collection flags. Missing is never treated
// as disabled. Both responses are projected in memory; unrelated fields are dropped.
// https://developers.cloudflare.com/api/resources/workers/subresources/scripts/subresources/settings/methods/get/
// https://developers.cloudflare.com/api/resources/workers/subresources/beta/subresources/workers/methods/get/
const API = "https://api.cloudflare.com/client/v4";
const WORKER = "oneclick-chatgpt";
const record = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
const own = (value, key) => Object.hasOwn(value, key);

class VerificationFailure extends Error {
  constructor(code) { super(code); this.code = code; }
}
function fail(code) { throw new VerificationFailure(code); }
function onlyKeys(value, allowed, code) {
  if (Object.keys(value).some((key) => !allowed.includes(key))) fail(code);
}
function falseRequired(value, key, code) {
  if (!own(value, key) || value[key] !== false) fail(code);
}
function optionalSampling(value, code) {
  if (own(value, "head_sampling_rate") && value.head_sampling_rate !== null &&
    !(typeof value.head_sampling_rate === "number" && Number.isFinite(value.head_sampling_rate) && value.head_sampling_rate >= 0 && value.head_sampling_rate <= 1)) fail(code);
}
function optionalBoolean(value, key, code) {
  if (own(value, key) && typeof value[key] !== "boolean") fail(code);
}
function checkDisabledCollectionPreferences(value, collection) {
  // Called only after enabled:false has been required. Cloudflare retains true
  // invocation/persistence preferences while collection is disabled. Validate
  // those preferences, report them honestly, and continue rejecting exports.
  optionalBoolean(value, "persist", `${collection}_persistence_preference_invalid`);
  if (own(value, "destinations") && (!Array.isArray(value.destinations) || value.destinations.length !== 0)) fail(`${collection}_destinations_not_empty`);
}

function privacySettingsFromResponse(payload, workerMetadata = false) {
  if (!record(payload) || payload.success !== true || !Array.isArray(payload.errors) || payload.errors.length !== 0 || !record(payload.result)) fail("api_response_not_successful");
  if (workerMetadata && payload.result.name !== WORKER) fail("worker_metadata_identity_mismatch");
  const settings = {};
  for (const key of ["observability", "logpush", "tail_consumers"]) {
    if (own(payload.result, key)) settings[key] = payload.result[key];
  }
  return settings;
}

function checkScriptControls(settings, workerMetadata = false) {
  falseRequired(settings, "logpush", "logpush_not_explicitly_disabled");
  // The SDK documents nullable tail_consumers. Require the field to be present:
  // an omitted field is not enough evidence for this independent release check.
  if (!own(settings, "tail_consumers") || (settings.tail_consumers === null ? workerMetadata : !Array.isArray(settings.tail_consumers) || settings.tail_consumers.length !== 0)) fail("tail_consumers_not_confirmed_absent");
}

function checkProjectedPrivacySettings(settings, workerMetadata = false) {
  if (!record(settings.observability)) fail("observability_settings_missing");
  const obs = settings.observability;
  onlyKeys(obs, ["enabled", "head_sampling_rate", "logs", "traces", "issues", "redact_query_string"], "observability_schema_unrecognised");
  falseRequired(obs, "enabled", "observability_not_explicitly_disabled");
  optionalSampling(obs, "observability_sampling_invalid");
  if (own(obs, "redact_query_string") && typeof obs.redact_query_string !== "boolean") fail("redaction_setting_invalid");

  // Logs/traces are optional and nullable in the official API schema. An absent
  // logs override inherits the explicitly disabled parent. Tracing is opt-in:
  // https://developers.cloudflare.com/workers/observability/traces/#how-to-enable-tracing
  // A present configuration must be explicitly disabled, not merely sampled at 0.
  // The newer Worker API is used specifically for explicit collection evidence,
  // so its fallback must return both child configurations as objects.
  if (workerMetadata && (!record(obs.logs) || !record(obs.traces))) fail("worker_collection_settings_missing");
  if (obs.logs !== undefined && obs.logs !== null) {
    if (!record(obs.logs)) fail("logs_schema_invalid");
    onlyKeys(obs.logs, ["enabled", "invocation_logs", "head_sampling_rate", "persist", "destinations"], "logs_schema_unrecognised");
    falseRequired(obs.logs, "enabled", "logs_not_explicitly_disabled");
    optionalBoolean(obs.logs, "invocation_logs", "invocation_logs_preference_invalid");
    optionalSampling(obs.logs, "logs_sampling_invalid");
    checkDisabledCollectionPreferences(obs.logs, "logs");
  }
  if (obs.traces !== undefined && obs.traces !== null) {
    if (!record(obs.traces)) fail("traces_schema_invalid");
    onlyKeys(obs.traces, ["enabled", "head_sampling_rate", "persist", "destinations", "propagation_policy"], "traces_schema_unrecognised");
    falseRequired(obs.traces, "enabled", "traces_not_explicitly_disabled");
    optionalSampling(obs.traces, "traces_sampling_invalid");
    checkDisabledCollectionPreferences(obs.traces, "traces");
    if (own(obs.traces, "propagation_policy") && ![null, "authenticated", "accept"].includes(obs.traces.propagation_policy)) fail("trace_propagation_setting_invalid");
  }
  if (own(obs, "issues")) {
    if (!record(obs.issues)) fail("issues_schema_invalid");
    onlyKeys(obs.issues, ["enabled"], "issues_schema_unrecognised");
    falseRequired(obs.issues, "enabled", "issues_not_explicitly_disabled");
  }
  checkScriptControls(settings, workerMetadata);
  return {
    observability_disabled: true,
    stored_logs_disabled: true,
    invocation_log_collection_disabled: true,
    tracing_disabled: true,
    issues_disabled: true,
    log_persistence_inactive: true,
    trace_persistence_inactive: true,
    no_export_destinations: true,
    logpush_disabled: true,
    no_tail_consumers: true,
    logs_configuration_present: record(obs.logs),
    traces_configuration_present: record(obs.traces),
    issues_configuration_present: record(obs.issues)
  };
}

export function checkPrivacySettings(payload) {
  return checkProjectedPrivacySettings(privacySettingsFromResponse(payload));
}

function inactivePreferences(settings) {
  // Only called after validation; null means the preference was not returned.
  const obs = settings.observability;
  return {
    logs_invocation_logs: obs.logs?.invocation_logs ?? null,
    logs_persist: obs.logs?.persist ?? null,
    traces_persist: obs.traces?.persist ?? null
  };
}

function credentials(env) {
  const token = env.CLOUDFLARE_API_TOKEN || env.CF_API_TOKEN;
  const account = env.CLOUDFLARE_ACCOUNT_ID || env.CF_ACCOUNT_ID;
  if (typeof token !== "string" || !token.trim()) fail("api_token_missing");
  if (typeof account !== "string" || !account.trim()) fail("account_id_missing");
  if (!/^[a-f0-9]{32}$/i.test(account.trim()) || /[\r\n]/.test(token)) fail("credentials_invalid");
  return { token: token.trim(), account: account.trim() };
}

export async function verifyProductionPrivacy({ env = process.env, fetchImpl = globalThis.fetch, now = () => new Date() } = {}) {
  const { token, account } = credentials(env);
  async function readSettings(workerMetadata = false) {
    const prefix = workerMetadata ? "cloudflare_worker_metadata" : "cloudflare_settings";
    const path = workerMetadata ? `workers/${WORKER}` : `scripts/${WORKER}/script-settings`;
    let response;
    try {
      response = await fetchImpl(`${API}/accounts/${account}/workers/${path}`, {
        method: "GET", redirect: "error", signal: AbortSignal.timeout(15_000),
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" }
      });
    } catch { fail(`${prefix}_read_failed`); }
    if (!(response instanceof Response) || !response.ok) fail(`${prefix}_http_failed`);
    let payload;
    try { payload = await response.json(); } catch { fail(`${prefix}_json_invalid`); }
    return privacySettingsFromResponse(payload, workerMetadata);
  }
  const narrow = await readSettings();
  // Unsafe or missing script controls must fail before any broader read. A
  // second endpoint must never hide evidence of enabled logging or consumers.
  checkScriptControls(narrow);
  let settings = narrow;
  let settingsSource = "script_settings";
  let workerMetadata = false;
  if (!own(narrow, "observability") || narrow.observability === null) {
    settings = await readSettings(true);
    settingsSource = "script_settings_and_worker_metadata";
    workerMetadata = true;
    // Both responses must independently confirm the script controls. The newer
    // Worker API requires an array for tail_consumers, unlike the narrow API.
    checkScriptControls(settings, true);
  }
  const checks = checkProjectedPrivacySettings(settings, workerMetadata);
  return { schema_version: 2, status: "verified", check: "production_privacy_settings", worker: WORKER, observed_at: now().toISOString(), settings_source: settingsSource, checks, inactive_preferences: inactivePreferences(settings) };
}

export function privacyFailureReport(error) {
  return { schema_version: 2, status: "failed", check: "production_privacy_settings", worker: WORKER,
    reason: error instanceof VerificationFailure ? error.code : "unexpected_verification_failure" };
}

async function saveEvidence(env, report) {
  if (!env.ONECLICK_PRIVACY_EVIDENCE_PATH) return;
  try {
    const path = resolve(env.ONECLICK_PRIVACY_EVIDENCE_PATH);
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, `${JSON.stringify(report, null, 2)}\n`, { mode: 0o600 });
  } catch { fail("privacy_evidence_write_failed"); }
}

export async function runProductionPrivacyVerification(options = {}) {
  const env = options.env || process.env;
  let report;
  try { report = await verifyProductionPrivacy({ ...options, env }); }
  catch (error) {
    // Overwrite an older receipt with a safe failure, so stale success cannot be
    // mistaken for evidence of this attempt. Remote error bodies are never saved.
    await saveEvidence(env, privacyFailureReport(error));
    throw error;
  }
  await saveEvidence(env, report);
  return report;
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  try { console.log(JSON.stringify(await runProductionPrivacyVerification(), null, 2)); }
  catch (error) { console.error(JSON.stringify(privacyFailureReport(error))); process.exitCode = 1; }
}
