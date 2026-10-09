import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const origin = "https://oneclickwebsitedesignfactory.com";
const pages = [["/chatgpt/", "A clear website brief"], ["/chatgpt/privacy/", "Privacy policy"], ["/chatgpt/terms/", "Terms"], ["/chatgpt/support/", "Support"]];
const report = { check: "owned_domain_information_pages", status: "failed", observed_at: new Date().toISOString(), pages: [] };
const require = (condition, code) => { if (!condition) throw new Error(code); };
try {
  for (const [path, heading] of pages) {
    const response = await fetch(origin + path, { headers: { DNT: "1", "Sec-GPC": "1" }, signal: AbortSignal.timeout(15000), redirect: "error" });
    const html = await response.text();
    require(response.status === 200 && (response.headers.get("content-type") || "").startsWith("text/html"), "information_page_http_failed");
    require(html.includes(`<link rel="canonical" href="${origin}${path}">`) && new RegExp(`<h1[^>]*>[^<]*${heading}`).test(html), "information_page_content_failed");
    require(html.includes("/chatgpt/support/"), "information_page_contact_missing");
    if (["/chatgpt/privacy/", "/chatgpt/support/"].includes(path)) require(html.includes("john@tailwaggingwebdesign.com"), "information_page_contact_missing");
    if (path !== "/chatgpt/") require(!/<script\b/i.test(html), "legal_page_script_detected");
    if (path === "/chatgpt/privacy/") {
      for (const field of ["industry", "primary_goal", "business_name", "brand_vibe", "headline", "call_to_action", "layout", "services"]) require(html.includes(`<code>${field}</code>`), "privacy_field_missing");
      for (const disclosure of ["three months", "90 days after closure", "website analytics disclosure added 8 October 2026"]) require(html.includes(disclosure), "privacy_disclosure_missing");
    }
    report.pages.push({ path, status: response.status, canonical: true, expected_content: true, scripts_absent: path === "/chatgpt/" ? null : true });
  }
  for (const [file, type] of [["site.css", "text/css"], ["analytics.mjs", "javascript"], ["analytics-core.mjs", "javascript"], ["analytics-config.mjs", "javascript"], ["sitemap.xml", "xml"]]) {
    const response = await fetch(`${origin}/chatgpt/${file}`, { headers: { DNT: "1", "Sec-GPC": "1" }, signal: AbortSignal.timeout(15000), redirect: "error" });
    require(response.status === 200 && (response.headers.get("content-type") || "").includes(type), "information_asset_failed");
    const content = await response.text();
    require(!content.includes('<div id="root">'), "spa_fallback_returned_as_asset");
    if (file === "sitemap.xml") for (const [path] of pages) require(content.includes(`<loc>${origin}${path}</loc>`), "sitemap_canonical_missing");
  }
  report.status = "verified";
} catch (cause) {
  const codes = new Set(["information_page_http_failed", "information_page_content_failed", "information_page_contact_missing", "legal_page_script_detected", "privacy_field_missing", "privacy_disclosure_missing", "information_asset_failed", "spa_fallback_returned_as_asset", "sitemap_canonical_missing"]);
  report.reason = codes.has(cause?.message) ? cause.message : "owned_domain_read_failed";
  process.exitCode = 1;
}
if (process.env.ONECLICK_INFORMATION_EVIDENCE_PATH) {
  const path = resolve(process.env.ONECLICK_INFORMATION_EVIDENCE_PATH);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify(report, null, 2) + "\n", { mode: 0o600 });
}
console.log(JSON.stringify(report, null, 2));
