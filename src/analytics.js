import { VERSION } from "./version.js";
import { TOOLS } from "./tools.js";

const TOOL_NAMES = new Set(TOOLS.map((tool) => tool.name));
const NATIVE_TOOLS=new Set(["oneclick_open_workspace","oneclick_open_brief_review","oneclick_get_full_access","oneclick_start_full_trial","oneclick_prepare_full_draft","oneclick_list_projects","oneclick_save_project","oneclick_get_knowledge_base","oneclick_save_knowledge_base","oneclick_get_handoff","oneclick_create_brand_kit","oneclick_list_support_tickets","oneclick_create_support_ticket","oneclick_create_checkout"]);
const OUTCOMES = new Set(["success", "error"]);

// Only fixed categories cross the telemetry boundary. A character whitelist is
// insufficient: an unknown tool name can itself contain private information.
export function record(env, ctx, request, event) {
  try {
    if (request.headers.get("dnt") === "1" || request.headers.get("sec-gpc") === "1") return;
    const binding = env.ONECLICK_ANALYTICS;
    if (typeof binding?.writeDataPoint !== "function") return;
    const ua = request.headers.get("user-agent") || "";
    const origin = request.headers.get("origin") || "";
    const client = /chatgpt|openai/i.test(`${ua} ${origin}`) ? "chatgpt" : /codex/i.test(ua) ? "codex" : "mcp";
    const tool = (TOOL_NAMES.has(event.tool)||(env.ONECLICK_NATIVE_ENABLED==="true"&&NATIVE_TOOLS.has(event.tool))) ? event.tool : "unknown_tool";
    const outcome = OUTCOMES.has(event.outcome) ? event.outcome : "unknown";
    const latency = Number.isFinite(event.latencyMs) ? Math.min(300_000, Math.max(0, Math.round(event.latencyMs))) : 0;
    const status = Number.isInteger(event.status) && event.status >= 100 && event.status <= 599 ? event.status : 0;
    const point = { indexes: [tool], blobs: ["tool_call", tool, outcome, client, env.ONECLICK_NATIVE_ENABLED==="true"?"1.1.0-candidate":VERSION], doubles: [latency, status] };
    const work = Promise.resolve().then(() => binding.writeDataPoint(point)).catch(() => undefined);
    ctx?.waitUntil?.(work);
  } catch {
    // Telemetry is best effort; never expose binding errors or request details.
  }
}
