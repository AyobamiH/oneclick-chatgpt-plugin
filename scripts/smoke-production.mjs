const base = process.env.ONECLICK_PRODUCTION_URL || "https://oneclick-chatgpt.woeinvests.workers.dev";
const probes = {};
for (const path of ["/", "/health", "/privacy", "/terms", "/support"]) {
  const response = await fetch(`${base}${path}`);
  probes[path] = { status: response.status, contentType: response.headers.get("content-type") };
}
if (probes["/health"].status !== 200) throw new Error(`production probes failed: ${JSON.stringify(probes)}`);
const response = await fetch(`${base}/mcp`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/list", params: {} }) });
const payload = await response.json();
const tools = payload?.result?.tools;
if (!response.ok || tools?.length !== 1 || tools[0]?.name !== "oneclick_prepare_basic_draft") throw new Error("MCP tools/list failed");
console.log(`Production smoke passed: ${base}`);
