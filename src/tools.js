import { prepareBasic } from "./draft.js";
import { textResult } from "./utils.js";

const string = (description, maxLength = 500) => ({ type: "string", maxLength, description });
const briefProperties = {
  business_name: string("Business or project name", 100), industry: string("Business type or industry", 120), location: string("Primary service location", 160),
  primary_goal: string("Primary website outcome", 240), brand_vibe: string("Desired brand personality", 160), headline: string("Optional headline direction", 180),
  call_to_action: string("Optional primary CTA", 80), layout: string("Optional One Click layout ID", 60), style_preset: string("Optional One Click style preset ID", 60),
  target_audience: string("Optional target audience", 300), additional_notes: string("Optional constraints and context", 1000),
  services: { type: "array", maxItems: 20, items: string("Service", 120) }, colours: { type: "array", maxItems: 8, items: string("Colour name or hex", 32) },
  reference_image_urls: { type: "array", maxItems: 10, items: { type: "string", maxLength: 500, pattern: "^https://" }, description: "HTTPS reference images selected by the user" }
};
const briefSchema = { type: "object", additionalProperties: false, required: ["business_name", "industry", "location", "primary_goal", "brand_vibe"], properties: briefProperties };
const readOnly = { readOnlyHint: true, destructiveHint: false, openWorldHint: false };

export const TOOLS = [
  { name: "oneclick_prepare_basic_draft", title: "Prepare website build brief", description: "Turn a rough business idea into an anonymous, structured, Lovable-ready website brief. The tool does not save data, create a project or claim a website was built.", inputSchema: briefSchema, outputSchema: { type: "object", additionalProperties: true }, annotations: readOnly }
];

export async function callTool(name, args) {
  if (name === "oneclick_prepare_basic_draft") return textResult(prepareBasic(args), "One Click prepared an anonymous Basic Mode handoff. Review it before creating the Lovable project.");
  throw new Error("tool_not_found");
}
