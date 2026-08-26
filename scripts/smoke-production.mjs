const base = process.env.ONECLICK_PRODUCTION_URL || "https://oneclick-chatgpt.woeinvests.workers.dev";
for (const path of ["/health", "/privacy", "/terms", "/support"]) { const response = await fetch(`${base}${path}`); if (!response.ok) throw new Error(`${path} returned ${response.status}`); }
const response = await fetch(`${base}/mcp`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/list", params: {} }) });
const payload = await response.json(); if (!response.ok || payload?.result?.tools?.length !== 6) throw new Error("MCP tools/list failed");
console.log(`Production smoke passed: ${base}`);

