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
// The current publisher-generated legacy release attaches its configured MCP
// and icon outside the exported two-file package. Keep that existing app
// identity and association rather than declaring a second MCP connection.
if (manifest.mcpServers || manifest.apps) throw new Error("Keep the existing publisher-managed MCP association for this link-only update");
await access(new URL("skills/build-with-one-click/SKILL.md", root));
console.log("Plugin manifest passed.");

