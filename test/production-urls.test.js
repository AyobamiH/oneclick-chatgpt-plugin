import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read = path => JSON.parse(readFileSync(new URL("../" + path, import.meta.url), "utf8"));
test("canonical release candidate uses the owned MCP domain and retains the published Basic connection", () => {
  const urls = read("deployment/production-urls.json");
  const old = read(".mcp.json"), candidate = read("release-candidate/1.1.0/.mcp.json");
  assert.equal(old.mcpServers["one-click"].url, urls.legacyMcpUrl);
  assert.deepEqual(candidate, { mcpServers: { "one-click": { url: urls.mcpUrl } } });
  const cfg = read("wrangler.production.jsonc");
  assert.equal(cfg.vars.ONECLICK_BACKEND_URL, urls.siteOrigin);
  assert.equal(cfg.vars.ONECLICK_SITE_URL, urls.siteOrigin);
  assert.equal(cfg.vars.ONECLICK_FULL_MODE_READY, "false");
});
