import { readFile, access } from "node:fs/promises";
const root = new URL("../", import.meta.url);
const pkg = JSON.parse(await readFile(new URL("package.json", root), "utf8"));
const manifest = JSON.parse(await readFile(new URL(".codex-plugin/plugin.json", root), "utf8"));
for (const field of ["name", "version", "description", "homepage", "repository", "license", "skills", "interface"]) if (!manifest[field]) throw new Error(`Missing manifest field: ${field}`);
if (manifest.version !== pkg.version) throw new Error("Package and plugin versions differ");
for (const value of [manifest.homepage, manifest.repository, manifest.interface.websiteURL, manifest.interface.privacyPolicyURL, manifest.interface.termsOfServiceURL, manifest.interface.supportURL]) {
  const url = new URL(value);
  if (url.protocol !== "https:" || url.username || url.password) throw new Error("Public URLs must use HTTPS without credentials");
}
for (const field of ["displayName", "shortDescription"]) if (!manifest.interface[field] || manifest.interface[field].length > 30) throw new Error(`${field} must be 1–30 characters`);
if (!Array.isArray(manifest.interface.capabilities) || manifest.interface.capabilities.length > 20) throw new Error("Missing or oversized capabilities list");
const prompts = [].concat(manifest.interface.defaultPrompt || []);
if (prompts.length > 3 || prompts.some(prompt => typeof prompt !== "string" || prompt.length > 128 || prompt.includes("@"))) throw new Error("Starter prompts must fit the public package limits");
if (manifest.mcpServers !== "./.mcp.json") throw new Error("Bundled MCP configuration must be included");
const mcp = JSON.parse(await readFile(new URL(".mcp.json", root), "utf8"));
const servers = Object.entries(mcp.mcpServers || {});
if (servers.length !== 1 || servers[0][0] !== "one-click" || servers[0][1].url !== "https://oneclick-chatgpt.woeinvests.workers.dev/mcp") throw new Error("Preserve the single existing production MCP endpoint");
await access(new URL("skills/build-with-one-click/SKILL.md", root)); await access(new URL(manifest.logo.replace(/^\.\//, ""), root));
console.log("Plugin manifest passed.");

