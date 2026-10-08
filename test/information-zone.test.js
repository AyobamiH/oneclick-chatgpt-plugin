import test from "node:test";
import assert from "node:assert/strict";
import { findInformationZone } from "../scripts/find-information-zone.mjs";

const env = { CF_API_TOKEN: "synthetic-private-token", CF_ACCOUNT_ID: "a".repeat(32) };
const zone = { name: "oneclickwebsitedesignfactory.com", id: "b".repeat(32), account: { id: "c".repeat(32), name: "private-marker" }, status: "active", unused: "private-marker" };
test("The zone read uses one fixed domain and distinguishes an already-accessible different account without exposing other fields", async () => {
  const report = await findInformationZone({ env, fetchImpl: async (url, options) => {
    assert.equal(url, "https://api.cloudflare.com/client/v4/zones?name=oneclickwebsitedesignfactory.com&per_page=1");
    assert.equal(options.method, "GET"); assert.equal(options.redirect, "error");
    assert.equal(options.headers.authorization, `Bearer ${env.CF_API_TOKEN}`);
    assert.equal("body" in options, false);
    return Response.json({ success: true, result: [zone] });
  } });
  assert.equal(report.account_matches_deployment, false);
  assert.equal(report.accountId, "c".repeat(32));
  assert.equal(JSON.stringify(report).includes("private-marker"), false);
});

test("Missing, inactive, wrong-identity or unauthorised zones cannot become routing success", async () => {
  for (const payload of [{ success: true, result: [] }, { success: false, result: [zone] }, { success: true, result: [{ ...zone, name: "other.example" }] }, { success: true, result: [{ ...zone, status: "pending" }] }]) {
    await assert.rejects(() => findInformationZone({ env, fetchImpl: async () => Response.json(payload) }), /domain_zone_/);
  }
  await assert.rejects(() => findInformationZone({ env, fetchImpl: async () => new Response("private-marker", { status: 403 }) }), /domain_zone_lookup_not_authorized/);
  await assert.rejects(() => findInformationZone({ env, fetchImpl: async () => { throw Error("private-marker"); } }), /domain_zone_read_failed/);
});
