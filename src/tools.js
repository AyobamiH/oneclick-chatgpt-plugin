import { prepareBasic } from "./draft.js";
import { textResult } from "./utils.js";

const LAYOUTS = ["simple-linear", "corporate-grid", "creative-story", "premium-luxury", "local-service", "modern-editorial", "bento-grid", "split-screen", "immersive-fullscreen", "card-modular", "timeline-journey"];
const string = (description, maxLength) => ({ type: "string", maxLength, description });

export const BASIC_INPUT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["industry", "primary_goal"],
  properties: {
    industry: string("Business type or industry needed to shape the website", 120),
    primary_goal: string("Primary outcome the website should help achieve", 240),
    business_name: string("Optional business or project name", 100),
    brand_vibe: string("Optional brand personality or visual direction", 160),
    headline: string("Optional headline direction", 180),
    call_to_action: string("Optional primary call to action", 80),
    layout: { type: "string", enum: LAYOUTS, description: "Optional supported One Click layout" },
    services: { type: "array", maxItems: 12, items: string("A service to include in the draft", 120), description: "Optional services the user explicitly wants represented" }
  }
};

// Preparing a brief appends a minimal operational event to One Click analytics.
// It does not delete/overwrite customer data and it does not browse or call arbitrary external services.
export const BASIC_ANNOTATIONS = { readOnlyHint: false, destructiveHint: false, openWorldHint: false };

export const TOOLS = [
  {
    name: "oneclick_prepare_basic_draft",
    title: "Prepare website build brief",
    description: "Prepare a bounded website build brief from the supplied website requirements. No One Click account is read and the business brief is not persisted. A minimal operational tool-call event may be written for reliability analytics. This tool does not create, publish or deploy a website.",
    inputSchema: BASIC_INPUT_SCHEMA,
    outputSchema: { type: "object", additionalProperties: true },
    annotations: BASIC_ANNOTATIONS
  }
];

const ALLOWED = new Set(Object.keys(BASIC_INPUT_SCHEMA.properties));
const REQUIRED = ["industry", "primary_goal"];

function invalid(message) { throw new Error(`invalid_input:${message}`); }
function assertString(args, key, maxLength, required = false) {
  const value = args[key];
  if (value === undefined) { if (required) invalid(`${key}_required`); return; }
  if (typeof value !== "string") invalid(`${key}_must_be_string`);
  if (required && !value.trim()) invalid(`${key}_required`);
  if (value.length > maxLength) invalid(`${key}_too_long`);
}

export function validateBasicArgs(args) {
  if (!args || typeof args !== "object" || Array.isArray(args)) invalid("object_required");
  for (const key of Object.keys(args)) if (!ALLOWED.has(key)) invalid(`unexpected_field:${key}`);
  assertString(args, "industry", 120, true);
  assertString(args, "primary_goal", 240, true);
  assertString(args, "business_name", 100);
  assertString(args, "brand_vibe", 160);
  assertString(args, "headline", 180);
  assertString(args, "call_to_action", 80);
  if (args.layout !== undefined && (!LAYOUTS.includes(args.layout))) invalid("layout_not_supported");
  if (args.services !== undefined) {
    if (!Array.isArray(args.services)) invalid("services_must_be_array");
    if (args.services.length > 12) invalid("too_many_services");
    for (const service of args.services) {
      if (typeof service !== "string") invalid("service_must_be_string");
      if (!service.trim()) invalid("service_must_not_be_empty");
      if (service.length > 120) invalid("service_too_long");
    }
  }
  for (const key of REQUIRED) if (!String(args[key] || "").trim()) invalid(`${key}_required`);
  return args;
}

export async function callTool(name, args) {
  if (name === "oneclick_prepare_basic_draft") {
    validateBasicArgs(args);
    return textResult(prepareBasic(args), "One Click prepared a Basic Mode handoff. Review it before authorising any external project creation.");
  }
  throw new Error("tool_not_found");
}
