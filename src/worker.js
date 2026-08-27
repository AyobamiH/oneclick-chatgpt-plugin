import { TOOLS, callTool } from "./tools.js";
import { record } from "./analytics.js";
import { landing, privacy, support, terms } from "./pages.js";
import { html, json } from "./utils.js";
import { VERSION } from "./version.js";

const SERVER = { name: "one-click", version: VERSION };
const INSTRUCTIONS = "Use One Click to turn a rough website idea into a structured, anonymous brief, then use the separately installed Lovable plugin to create the project. This initial release is ephemeral and does not read or save One Click accounts. Review the handoff before an external build, upload only user-selected references, and distinguish draft preparation from project creation and deployment.";
const ok = (id, result) => ({ jsonrpc: "2.0", id, result });
const error = (id, code, message) => ({ jsonrpc: "2.0", id: id ?? null, error: { code, message } });

async function rpc(payload, request, env, ctx) {
  if (!payload || payload.jsonrpc !== "2.0" || typeof payload.method !== "string") return error(payload?.id, -32600, "Invalid Request");
  const { id, method, params = {} } = payload;
  if (method === "initialize") return ok(id, { protocolVersion: params.protocolVersion || "2025-06-18", capabilities: { tools: { listChanged: false } }, serverInfo: SERVER, instructions: INSTRUCTIONS });
  if (method === "ping") return ok(id, {});
  if (method === "tools/list") return ok(id, { tools: TOOLS });
  if (method === "tools/call") {
    if (!params.name) return error(id, -32602, "Tool name required");
    const started = Date.now();
    try { const result = await callTool(params.name, params.arguments || {}, request, env); record(env, ctx, request, { tool: params.name, outcome: "success", status: 200, latencyMs: Date.now() - started }); return ok(id, result); }
    catch (cause) { record(env, ctx, request, { tool: params.name, outcome: "error", status: 200, latencyMs: Date.now() - started }); return ok(id, { isError: true, content: [{ type: "text", text: `One Click could not prepare the handoff: ${cause instanceof Error ? cause.message : String(cause)}` }], structuredContent: { status: "blocked", stateChanged: false } }); }
  }
  if (method.startsWith("notifications/")) return null;
  return error(id, -32601, "Method not found");
}

function cors(request) { return { "access-control-allow-origin": "*", "access-control-allow-methods": "POST, OPTIONS", "access-control-allow-headers": request.headers.get("access-control-request-headers") || "authorization, content-type, mcp-protocol-version, mcp-session-id", "access-control-expose-headers": "mcp-session-id, www-authenticate" }; }
async function mcp(request, env, ctx) {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(request) });
  if (request.method !== "POST") return json({ error: "method_not_allowed" }, 405, { allow: "POST, OPTIONS", ...cors(request) });
  let payload; try { payload = await request.json(); } catch { return json(error(null, -32700, "Parse error"), 400, cors(request)); }
  const result = await rpc(payload, request, env, ctx); if (result === null) return new Response(null, { status: 202, headers: cors(request) });
  return json(result, 200, { ...cors(request), "mcp-protocol-version": "2025-06-18" });
}

export async function fetchHandler(request, env = {}, ctx = {}) {
  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/oneclick-chatgpt-plugin(?=\/|$)/, "") || "/";
  if (path === "/mcp") return mcp(request, env, ctx);
  if (path === "/health") return json({ status: "ok", service: SERVER.name, version: VERSION, tools: TOOLS.length, mode: "anonymous_basic", analytics: env.ONECLICK_ANALYTICS ? "configured" : "not_configured" });
  if (path === "/.well-known/openai-apps-challenge") return env.OPENAI_APPS_CHALLENGE ? new Response(env.OPENAI_APPS_CHALLENGE, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" } }) : new Response("Not configured", { status: 404 });
  if (path === "/privacy") return html(privacy());
  if (path === "/terms") return html(terms());
  if (path === "/support") return html(support());
  if (path === "/" || path === "/index.html") return html(landing(url.origin));
  return json({ error: "not_found" }, 404);
}
export default { fetch: fetchHandler };
export { rpc };
