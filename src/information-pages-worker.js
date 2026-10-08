const UPSTREAM = "https://oneclickwebsitedesignfactory.pages.dev";
const paths = new Map([
  ["/chatgpt/", "text/html"],
  ["/chatgpt/privacy/", "text/html"],
  ["/chatgpt/terms/", "text/html"],
  ["/chatgpt/support/", "text/html"],
  ["/chatgpt/site.css", "text/css"],
  ["/chatgpt/analytics.mjs", "javascript"],
  ["/chatgpt/analytics-core.mjs", "javascript"]
]);
const aliases = new Map([
  ["/chatgpt", "/chatgpt/"],
  ["/chatgpt/index.html", "/chatgpt/"],
  ...["privacy", "terms", "support"].flatMap(name => [
    [`/chatgpt/${name}`, `/chatgpt/${name}/`],
    [`/chatgpt/${name}/index.html`, `/chatgpt/${name}/`]
  ])
]);
const failure = (status, message, headers = {}) => new Response(message, {
  status, headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store", ...headers }
});

export async function serveInformationPage(request, fetchImpl = fetch) {
  if (!["GET", "HEAD"].includes(request.method)) return failure(405, "Method not allowed", { allow: "GET, HEAD" });
  const url = new URL(request.url);
  if (aliases.has(url.pathname)) {
    url.pathname = aliases.get(url.pathname);
    return Response.redirect(url.href, 308);
  }
  if (url.pathname === "/chatgpt/sitemap.xml") {
    const entries = ["", "privacy/", "terms/", "support/"].map(path => `<url><loc>https://oneclickwebsitedesignfactory.com/chatgpt/${path}</loc></url>`).join("");
    return new Response(request.method === "HEAD" ? null : `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>`, { headers: {
      "content-type": "application/xml; charset=utf-8", "cache-control": "public, max-age=120", "x-content-type-options": "nosniff"
    } });
  }
  const expectedType = paths.get(url.pathname);
  if (!expectedType) return failure(404, "Not found");
  try {
    // Fetch only fixed public files. Do not forward visitor queries, credentials,
    // cookies, referrers, request bodies or caller-selected origins/headers.
    const response = await fetchImpl(UPSTREAM + url.pathname, {
      method: request.method, redirect: "error", headers: { accept: expectedType === "javascript" ? "text/javascript, application/javascript" : expectedType, "accept-encoding": "identity" },
      signal: AbortSignal.timeout(10000)
    });
    const type = (response.headers.get("content-type") || "").toLowerCase();
    const validType = expectedType === "javascript" ? /^(text|application)\/javascript(?:;|$)/.test(type) : type === expectedType || type.startsWith(expectedType + ";");
    if (response.status !== 200 || !validType) return failure(503, "Information page temporarily unavailable");
    const headers = {
      "content-type": type,
      "cache-control": "public, max-age=120",
      "x-content-type-options": "nosniff",
      "referrer-policy": "strict-origin-when-cross-origin"
    };
    if (response.headers.get("content-encoding")) headers["content-encoding"] = response.headers.get("content-encoding");
    return new Response(request.method === "HEAD" ? null : response.body, { status: 200, headers });
  } catch {
    return failure(503, "Information page temporarily unavailable");
  }
}

export default { fetch: request => serveInformationPage(request) };
