import { appendFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const DOMAIN = "oneclickwebsitedesignfactory.com";
const hexId = value => typeof value === "string" && /^[a-f0-9]{32}$/i.test(value);
export async function findInformationZone({ env = process.env, fetchImpl = fetch } = {}) {
  const token = env.CF_API_TOKEN || env.CLOUDFLARE_API_TOKEN;
  const account = env.CF_ACCOUNT_ID || env.CLOUDFLARE_ACCOUNT_ID;
  if (typeof token !== "string" || !token.trim() || /[\r\n]/.test(token) || !hexId(account)) throw Error("deployment_credentials_invalid");
  let response;
  try { response = await fetchImpl(`https://api.cloudflare.com/client/v4/zones?name=${DOMAIN}&per_page=1`, {
    method: "GET", redirect: "error", signal: AbortSignal.timeout(15000), headers: { authorization: `Bearer ${token}`, accept: "application/json" }
  }); } catch { throw Error("domain_zone_read_failed"); }
  if (!response.ok) throw Error("domain_zone_lookup_not_authorized");
  let payload; try { payload = await response.json(); } catch { throw Error("domain_zone_response_invalid"); }
  if (payload.success !== true || !Array.isArray(payload.result) || payload.result.length !== 1) throw Error("domain_zone_not_visible_to_deployment_credentials");
  const zone = payload.result[0];
  if (zone.name !== DOMAIN || !hexId(zone.id) || !hexId(zone.account?.id)) throw Error("domain_zone_identity_invalid");
  if (zone.status !== "active") throw Error("domain_zone_not_active");
  return { status: "verified", domain: DOMAIN, account_matches_deployment: zone.account.id === account, accountId: zone.account.id };
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  try {
    const result = await findInformationZone();
    if (process.env.GITHUB_OUTPUT && !result.account_matches_deployment) await appendFile(process.env.GITHUB_OUTPUT, `account_id=${result.accountId}\n`);
    const { accountId, ...publicReport } = result;
    console.log(JSON.stringify(publicReport));
  } catch (cause) {
    const reasons = new Set(["deployment_credentials_invalid", "domain_zone_read_failed", "domain_zone_lookup_not_authorized", "domain_zone_response_invalid", "domain_zone_not_visible_to_deployment_credentials", "domain_zone_identity_invalid", "domain_zone_not_active"]);
    console.error(JSON.stringify({ status: "failed", domain: DOMAIN, reason: reasons.has(cause?.message) ? cause.message : "domain_zone_read_failed" }));
    process.exitCode = 1;
  }
}
