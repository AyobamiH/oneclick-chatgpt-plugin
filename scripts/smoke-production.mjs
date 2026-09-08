const base = process.env.ONECLICK_PRODUCTION_URL || "https://oneclick-chatgpt.woeinvests.workers.dev";

async function rpc(method, params = {}) {
  const response = await fetch(`${base}/mcp`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params })
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(`MCP ${method} failed with ${response.status}`);
  return payload;
}

for (const path of ["/", "/health", "/privacy", "/terms", "/support"]) {
  const response = await fetch(`${base}${path}`);
  if (response.status !== 200) throw new Error(`production probe failed for ${path}: ${response.status}`);
}

const health = await (await fetch(`${base}/health`)).json();
if (health.status !== "ok" || health.tools !== 1) throw new Error(`unexpected health payload: ${JSON.stringify(health)}`);

const init = await rpc("initialize");
if (!/Do not send unrelated conversation history/i.test(init?.result?.instructions || "")) throw new Error("MCP instructions are not reviewer-safe");

const listed = await rpc("tools/list");
const tools = listed?.result?.tools;
if (tools?.length !== 1 || tools[0]?.name !== "oneclick_prepare_basic_draft") throw new Error("unexpected MCP tool catalogue");
const annotations = tools[0]?.annotations || {};
if (annotations.readOnlyHint !== false || annotations.destructiveHint !== false || annotations.openWorldHint !== false) throw new Error(`unexpected annotations: ${JSON.stringify(annotations)}`);
const properties = tools[0]?.inputSchema?.properties || {};
for (const forbidden of ["location", "additional_notes", "reference_image_urls"]) if (forbidden in properties) throw new Error(`broad field still exposed: ${forbidden}`);

const valid = await rpc("tools/call", { name: "oneclick_prepare_basic_draft", arguments: { industry: "Pet grooming", primary_goal: "Book appointments", services: ["Dog grooming"] } });
if (valid?.result?.isError || valid?.result?.structuredContent?.projectCreated !== false) throw new Error("valid Basic Mode call failed");
if (!/Dog grooming/.test(valid?.result?.structuredContent?.lovable?.initial_message || "")) throw new Error("retained service input did not reach handoff");

const invalid = await rpc("tools/call", { name: "oneclick_prepare_basic_draft", arguments: { industry: "Pet care", primary_goal: "Get enquiries", conversation_history: "must not pass" } });
if (invalid?.result?.isError !== true) throw new Error("unexpected broad input was not rejected");

console.log(`Production smoke passed: ${base} version=${health.version}`);
