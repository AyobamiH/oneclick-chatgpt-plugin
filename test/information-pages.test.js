import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { serveInformationPage } from "../src/information-pages-worker.js";

test("Public information requests cannot forward visitor data or select an upstream", async () => {
  const request = new Request("https://oneclickwebsitedesignfactory.com/chatgpt/?utm_source=linkedin&prompt=private-marker", {
    headers: { cookie: "private-cookie", authorization: "private-credential", referer: "https://private.example/", "x-forwarded-for": "192.0.2.10" }
  });
  const response = await serveInformationPage(request, async (url, options) => {
    assert.equal(url, "https://oneclickwebsitedesignfactory.pages.dev/chatgpt/");
    assert.equal(options.method, "GET");
    assert.equal(options.redirect, "error");
    assert.deepEqual(options.headers, { accept: "text/html", "accept-encoding": "identity" });
    assert.equal("body" in options, false);
    assert.equal(options.signal instanceof AbortSignal, true);
    return new Response("<h1>Public page</h1>", { headers: { "content-type": "text/html; charset=utf-8", "set-cookie": "unexpected=private", "x-provider-debug": "private-marker" } });
  });
  assert.equal(response.status, 200);
  assert.equal(response.headers.has("set-cookie"), false);
  assert.equal(response.headers.has("x-provider-debug"), false);
  assert.equal(await response.text(), "<h1>Public page</h1>");
});

test("Only the eight public files may be fetched; account and MCP routes do not reach an upstream", async () => {
  let calls = 0;
  for (const path of ["/", "/privacy", "/terms", "/auth", "/mcp", "/chatgpt/account", "/chatgpt/unknown.mjs", "/chatgpt/%2f%2fevil.example/", "/chatgpt/../auth"]) {
    const response = await serveInformationPage(new Request("https://oneclickwebsitedesignfactory.com" + path), async () => { calls++; return new Response("unexpected"); });
    assert.equal(response.status, 404, path);
  }
  assert.equal(calls, 0);
});

test("Non-read requests are rejected without forwarding their body", async () => {
  let calls = 0;
  for (const method of ["POST", "PUT", "PATCH", "DELETE", "OPTIONS"]) {
    const response = await serveInformationPage(new Request("https://oneclickwebsitedesignfactory.com/chatgpt/", { method, body: "private-marker" }), async () => { calls++; });
    assert.equal(response.status, 405);
    assert.equal(response.headers.get("allow"), "GET, HEAD");
  }
  assert.equal(calls, 0);
});

test("Canonical aliases stay on the caller origin and preserve the visitor's campaign URL", async () => {
  for (const path of ["/chatgpt", "/chatgpt/index.html", "/chatgpt/privacy", "/chatgpt/terms/index.html", "/chatgpt/support/index.html"]) {
    const response = await serveInformationPage(new Request("https://oneclickwebsitedesignfactory.com" + path + "?utm_source=linkedin"), async () => { throw Error("No upstream expected"); });
    assert.equal(response.status, 308);
    const location = new URL(response.headers.get("location"));
    assert.equal(location.origin, "https://oneclickwebsitedesignfactory.com");
    assert.equal(location.search, "?utm_source=linkedin");
    assert.equal(location.pathname.endsWith("/"), true);
  }
});

test("Upstream failures and unexpected content never expose a provider body or serve SPA HTML as JavaScript", async () => {
  for (const fetchImpl of [
    async () => { throw Error("private-marker"); },
    async () => new Response("private-marker", { status: 502, headers: { "content-type": "text/javascript" } }),
    async () => new Response("private-marker", { headers: { "content-type": "text/html" } }),
    async () => new Response("private-marker", { status: 302, headers: { location: "https://private.example", "content-type": "text/javascript" } })
  ]) {
    const response = await serveInformationPage(new Request("https://oneclickwebsitedesignfactory.com/chatgpt/analytics.mjs"), fetchImpl);
    assert.equal(response.status, 503);
    assert.equal(await response.text(), "Information page temporarily unavailable");
    assert.equal(response.headers.get("cache-control"), "no-store");
  }
});

test("Legal pages and all assets are readable with their correct content types", async () => {
  for (const [path, type] of [["privacy/", "text/html"], ["terms/", "text/html"], ["support/", "text/html"], ["site.css", "text/css"], ["analytics.mjs", "text/javascript"], ["analytics-core.mjs", "application/javascript"], ["analytics-config.mjs", "application/javascript"]]) {
    const response = await serveInformationPage(new Request("https://oneclickwebsitedesignfactory.com/chatgpt/" + path), async () => new Response("public", { headers: { "content-type": type } }));
    assert.equal(response.status, 200, path);
    assert.equal(response.headers.get("content-type"), type);
    assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  }
});

test("HEAD preserves the content type without returning a body", async () => {
  const response = await serveInformationPage(new Request("https://oneclickwebsitedesignfactory.com/chatgpt/", { method: "HEAD" }), async (url, options) => {
    assert.equal(options.method, "HEAD");
    return new Response(null, { headers: { "content-type": "text/html" } });
  });
  assert.equal(response.status, 200);
  assert.equal(await response.text(), "");
});

test("The plugin sitemap lists only the four canonical owned-domain pages and makes no upstream request", async () => {
  const response = await serveInformationPage(new Request("https://oneclickwebsitedesignfactory.com/chatgpt/sitemap.xml?private=marker"), async () => { throw Error("No upstream expected"); });
  const xml = await response.text();
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "application/xml; charset=utf-8");
  assert.deepEqual([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]), [
    "https://oneclickwebsitedesignfactory.com/chatgpt/", "https://oneclickwebsitedesignfactory.com/chatgpt/privacy/",
    "https://oneclickwebsitedesignfactory.com/chatgpt/terms/", "https://oneclickwebsitedesignfactory.com/chatgpt/support/"
  ]);
  assert.equal(xml.includes("marker"), false);
});

test("The information Worker routes only the plugin prefix and has no operational analytics binding or stored logs", async () => {
  const config = JSON.parse(await readFile(new URL("../wrangler-pages.jsonc", import.meta.url), "utf8"));
  assert.equal(config.routes.every(route => route.zone_name === "oneclickwebsitedesignfactory.com" && ["oneclickwebsitedesignfactory.com/chatgpt/*", "oneclickwebsitedesignfactory.com/chatgpt"].includes(route.pattern)), true);
  assert.equal(config.workers_dev, true);
  assert.equal(config.observability.enabled, false);
  assert.equal(config.observability.logs.enabled, false);
  assert.equal(config.logpush, false);
  assert.equal(config.analytics_engine_datasets, undefined);
});


test("The added fixed analytics configuration asset strips visitor data before fetching", async () => {
  const request = new Request("https://oneclickwebsitedesignfactory.com/chatgpt/analytics-config.mjs?private=marker", {
    headers: { cookie: "private-cookie", authorization: "private-token", referer: "https://private.example/" }
  });
  const response = await serveInformationPage(request, async (url, options) => {
    assert.equal(url, "https://oneclickwebsitedesignfactory.pages.dev/chatgpt/analytics-config.mjs");
    assert.deepEqual(options.headers, { accept: "text/javascript, application/javascript", "accept-encoding": "identity" });
    assert.equal("body" in options, false);
    return new Response("export const publicConfig = true;", { headers: { "content-type": "application/javascript" } });
  });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "application/javascript");
});
