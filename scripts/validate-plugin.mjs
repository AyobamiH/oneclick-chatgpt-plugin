import { readFile, access } from "node:fs/promises";
const root = new URL("../", import.meta.url);
const pkg = JSON.parse(await readFile(new URL("package.json", root), "utf8"));
const manifest = JSON.parse(await readFile(new URL(".codex-plugin/plugin.json", root), "utf8"));
for (const field of ["name", "version", "description", "homepage", "repository", "license", "skills", "interface"]) if (!manifest[field]) throw new Error(`Missing manifest field: ${field}`);
if (manifest.version !== pkg.version) throw new Error("Package and plugin versions differ");
for (const value of [manifest.homepage, manifest.repository, manifest.interface.website, manifest.interface.privacyPolicy, manifest.interface.termsOfService, manifest.interface.support]) new URL(value);
await access(new URL("skills/build-with-one-click/SKILL.md", root)); await access(new URL(manifest.logo.replace(/^\.\//, ""), root));
console.log("Plugin manifest passed.");

