import { VERSION } from "./version.js";

function safe(value) { const v = String(value || "unknown").toLowerCase(); return /^[a-z0-9_:-]{1,96}$/.test(v) ? v : "unknown"; }
export function record(env, ctx, request, event) {
  const binding = env.ONECLICK_ANALYTICS;
  if (!binding?.writeDataPoint) return;
  const ua = request.headers.get("user-agent") || "";
  const origin = request.headers.get("origin") || "";
  const client = /chatgpt|openai/i.test(`${ua} ${origin}`) ? "chatgpt" : /codex/i.test(ua) ? "codex" : "mcp";
  const work = Promise.resolve().then(() => binding.writeDataPoint({ indexes: [safe(event.tool)], blobs: ["tool_call", safe(event.tool), safe(event.outcome), client, VERSION], doubles: [Math.max(0, Math.round(event.latencyMs || 0)), event.status || 0] })).catch(() => undefined);
  ctx?.waitUntil?.(work);
}

