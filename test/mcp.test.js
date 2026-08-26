import test from "node:test";
import assert from "node:assert/strict";
import { fetchHandler } from "../src/worker.js";

const env = { ONECLICK_SITE_URL: "https://oneclickwebsitedesignfactory.com" };
const ctx = { waitUntil() {} };
async function call(method, params = {}) { const response = await fetchHandler(new Request("https://plugin.example/mcp", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }) }), env, ctx); return response.json(); }
test("MCP initialises and lists tools", async () => { assert.equal((await call("initialize")).result.serverInfo.name, "one-click"); assert.equal((await call("tools/list")).result.tools.length, 6); });
test("Basic draft works without auth", async () => { const result = await call("tools/call", { name: "oneclick_prepare_basic_draft", arguments: { business_name: "A", industry: "B", location: "C", primary_goal: "D", brand_vibe: "E" } }); assert.equal(result.result.structuredContent.tier, "basic"); });
test("Full draft requests existing One Click auth", async () => { const result = await call("tools/call", { name: "oneclick_prepare_full_handoff", arguments: { business_name: "A", industry: "B", location: "C", primary_goal: "D", brand_vibe: "E" } }); assert.equal(result.result.structuredContent.status, "authentication_required"); });
test("Health and legal pages are served", async () => { for (const path of ["/health", "/privacy", "/terms", "/support"]) assert.equal((await fetchHandler(new Request(`https://plugin.example${path}`), env, ctx)).status, 200); });

