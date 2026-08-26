import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
const root = new URL("../", import.meta.url);
async function files(dir) { const out = []; for (const entry of await readdir(dir, { withFileTypes: true })) { if ([".git", "node_modules", ".wrangler"].includes(entry.name)) continue; const path = join(dir, entry.name); if (entry.isDirectory()) out.push(...await files(path)); else out.push(path); } return out; }
const patterns = [/sk-[A-Za-z0-9_-]{20,}/, /ghp_[A-Za-z0-9]{20,}/, /BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY/, /service_role\s*[:=]\s*["'][^"']+/i];
for (const path of await files(root.pathname)) { if (!/\.(?:js|mjs|json|jsonc|md|yml|yaml|svg)$/.test(path)) continue; const text = await readFile(path, "utf8"); for (const pattern of patterns) if (pattern.test(text)) throw new Error(`Sensitive pattern in ${path}`); }
console.log("Source scan passed.");

