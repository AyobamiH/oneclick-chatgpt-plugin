import { readFile, access } from "node:fs/promises";
const root = new URL("../", import.meta.url);
const pkg = JSON.parse(await readFile(new URL("package.json", root), "utf8"));
const manifest = JSON.parse(await readFile(new URL(".codex-plugin/plugin.json", root), "utf8"));
for (const field of ["name", "version", "description", "author", "skills", "interface"]) if (!manifest[field]) throw new Error(`Missing manifest field: ${field}`);
if (manifest.version !== pkg.version) throw new Error("Package and plugin versions differ");
if (manifest.name !== "app-698c5319a3c8819180537c0c37cde979") throw new Error("Preserve the package identity shown by the existing One Click publisher entry");
for (const value of [manifest.interface.websiteURL, manifest.interface.privacyPolicyURL, manifest.interface.termsOfServiceURL, manifest.interface.supportURL]) {
  const url = new URL(value);
  if (url.protocol !== "https:" || url.username || url.password) throw new Error("Public URLs must use HTTPS without credentials");
}
for (const field of ["displayName", "shortDescription"]) if (!manifest.interface[field] || manifest.interface[field].length > 30) throw new Error(`${field} must be 1–30 characters`);
if (!Array.isArray(manifest.interface.capabilities) || manifest.interface.capabilities.length > 20) throw new Error("Missing or oversized capabilities list");
const prompts = [].concat(manifest.interface.defaultPrompt || []);
if (prompts.length > 3 || prompts.some(prompt => typeof prompt !== "string" || prompt.length > 128 || prompt.includes("@"))) throw new Error("Starter prompts must fit the public package limits");
// The publisher requires explicit retention of the existing remote MCP.
if (manifest.apps || manifest.mcpServers !== "./.mcp.json") throw new Error("Retain the existing MCP declaration without app references");
const mcp = JSON.parse(await readFile(new URL(".mcp.json", root), "utf8"));
if (Object.keys(mcp.mcpServers || {}).join() !== "one-click" || mcp.mcpServers["one-click"].url !== "https://oneclick-chatgpt.woeinvests.workers.dev/mcp" || Object.keys(mcp.mcpServers["one-click"]).join() !== "url") throw new Error("Preserve the single existing unauthenticated MCP endpoint");
for (const field of ["composerIcon", "composerIconDark", "logo", "logoDark"]) {
  if (manifest.interface[field] !== "./assets/logo.png") throw new Error("Keep the repository icon in the complete package");
}
await access(new URL("assets/logo.png", root));
await access(new URL("skills/build-with-one-click/SKILL.md", root));
console.log("Plugin manifest passed.");


await import("./validate-native-candidate.mjs");
