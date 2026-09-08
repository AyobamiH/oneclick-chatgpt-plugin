import test from "node:test";
import assert from "node:assert/strict";
import { fetchHandler } from "../src/worker.js";

function context() { return { waitUntil() {} }; }
function envWithAnalytics(events = []) {
  return {
    ONECLICK_SITE_URL: "https://oneclickwebsitedesignfactory.com",
    ONECLICK_ANALYTICS: { writeDataPoint(point) { events.push(point); } }
  };
}
async function call(method, params = {}, env = { ONECLICK_SITE_URL: "https://oneclickwebsitedesignfactory.com" }) {
  const response = await fetchHandler(new Request("https://plugin.example/mcp", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params })
  }), env, context());
  return { response, body: await response.json() };
}

test("MCP exposes one bounded tool with explicit annotations", async () => {
  const init = await call("initialize");
  assert.equal(init.body.result.serverInfo.name, "one-click");
  assert.match(init.body.result.instructions, /Do not send unrelated conversation history/i);
  const listed = await call("tools/list");
  const tools = listed.body.result.tools;
  assert.equal(tools.length, 1);
  assert.equal(tools[0].name, "oneclick_prepare_basic_draft");
  assert.deepEqual(tools[0].annotations, { readOnlyHint: false, destructiveHint: false, openWorldHint: false });
  assert.equal(tools[0].inputSchema.additionalProperties, false);
  assert.deepEqual(tools[0].inputSchema.required, ["industry", "primary_goal"]);
  assert.equal("additional_notes" in tools[0].inputSchema.properties, false);
  assert.equal("location" in tools[0].inputSchema.properties, false);
  assert.equal("reference_image_urls" in tools[0].inputSchema.properties, false);
});

test("Basic draft uses only task-specific website fields", async () => {
  const { body } = await call("tools/call", { name: "oneclick_prepare_basic_draft", arguments: {
    industry: "Pet grooming",
    primary_goal: "Book appointments",
    business_name: "Northampton Paws",
    brand_vibe: "Friendly and trustworthy",
    services: ["Dog grooming"],
    layout: "local-service"
  } });
  assert.equal(body.result.structuredContent.tier, "basic");
  assert.equal(body.result.structuredContent.projectCreated, false);
  assert.match(body.result.structuredContent.lovable.initial_message, /Dog grooming/);
  assert.doesNotMatch(body.result.structuredContent.lovable.initial_message, /Location:/);
});

test("Unexpected, broad and malformed inputs are rejected", async () => {
  for (const args of [
    { industry: "Pet care", primary_goal: "Get enquiries", conversation_history: "private marker" },
    { industry: { value: "Pet care" }, primary_goal: "Get enquiries" },
    { industry: "Pet care", primary_goal: "Get enquiries", services: "Grooming" },
    { industry: "Pet care", primary_goal: "Get enquiries", layout: "arbitrary-layout" }
  ]) {
    const { body } = await call("tools/call", { name: "oneclick_prepare_basic_draft", arguments: args });
    assert.equal(body.result.isError, true);
    assert.equal(body.result.structuredContent.projectCreated, false);
  }
});

test("Tool-call analytics match the non-read-only annotation without logging brief content", async () => {
  const events = [];
  const env = envWithAnalytics(events);
  const privateMarker = "SYNTHETIC_PRIVATE_MARKER_9F3A";
  const { body } = await call("tools/call", { name: "oneclick_prepare_basic_draft", arguments: {
    industry: "Pet grooming",
    primary_goal: `Get enquiries ${privateMarker}`
  } }, env);
  assert.equal(body.result.structuredContent.tier, "basic");
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(events.length, 1);
  const serialized = JSON.stringify(events[0]);
  assert.doesNotMatch(serialized, new RegExp(privateMarker));
  assert.match(serialized, /oneclick_prepare_basic_draft/);
});

test("Oversized MCP bodies are rejected before parsing", async () => {
  const response = await fetchHandler(new Request("https://plugin.example/mcp", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "x".repeat(70 * 1024)
  }), {}, context());
  assert.equal(response.status, 413);
});

test("Health and legal pages are served", async () => {
  for (const path of ["/health", "/privacy", "/terms", "/support"]) {
    assert.equal((await fetchHandler(new Request(`https://plugin.example${path}`), {}, context())).status, 200);
  }
});
