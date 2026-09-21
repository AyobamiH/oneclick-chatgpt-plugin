import { VERSION } from "./version.js";
import { TOOLS } from "./tools.js";

const TOOL_NAMES = new Set(TOOLS.map((tool) => tool.name));
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
    const tool = TOOL_NAMES.has(event.tool) ? event.tool : "unknown_tool";
    const outcome = OUTCOMES.has(event.outcome) ? event.outcome : "unknown";
    const latency = Number.isFinite(event.latencyMs) ? Math.min(300_000, Math.max(0, Math.round(event.latencyMs))) : 0;
    const status = Number.isInteger(event.status) && event.status >= 100 && event.status <= 599 ? event.status : 0;
    const point = { indexes: [tool], blobs: ["tool_call", tool, outcome, client, VERSION], doubles: [latency, status] };
    const work = Promise.resolve().then(() => binding.writeDataPoint(point)).catch(() => undefined);
    ctx?.waitUntil?.(work);
  } catch {
    // Telemetry is best effort; never expose binding errors or request details.
  }
}
